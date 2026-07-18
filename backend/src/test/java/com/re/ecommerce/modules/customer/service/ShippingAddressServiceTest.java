package com.re.ecommerce.modules.customer.service;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.customer.dto.request.AddressCreateRequest;
import com.re.ecommerce.modules.customer.dto.request.AddressUpdateRequest;
import com.re.ecommerce.modules.customer.dto.response.AddressResponse;
import com.re.ecommerce.modules.customer.entity.ShippingAddress;
import com.re.ecommerce.modules.customer.mapper.ShippingAddressMapper;
import com.re.ecommerce.modules.customer.repository.ShippingAddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShippingAddressServiceTest {

    @Mock
    private ShippingAddressRepository addressRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ShippingAddressMapper mapper;

    @InjectMocks
    private ShippingAddressService shippingAddressService;

    private User mockUser;
    private CustomerProfile mockCustomer;
    private ShippingAddress mockAddress;
    private UUID userId;
    private UUID addressId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        addressId = UUID.randomUUID();

        mockUser = new User("testuser", "test@test.com", "hash", "USER");
        org.springframework.test.util.ReflectionTestUtils.setField(mockUser, "id", userId);

        mockCustomer = new CustomerProfile(mockUser, "CUST-001");
        org.springframework.test.util.ReflectionTestUtils.setField(mockCustomer, "id", userId);

        mockAddress = new ShippingAddress(mockCustomer, "Receiver", "01", "Prov", "Dist", "Ward", "Detail");
        org.springframework.test.util.ReflectionTestUtils.setField(mockAddress, "id", addressId);
        mockAddress.setDefault(false);
    }

    // [Test] Happy path: User retrieves their active addresses
    @Test
    void listAddresses_shouldReturnsAddressesForUser() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findActiveByCustomerId(userId)).thenReturn(List.of(mockAddress));
        
        AddressResponse mockResponse = new AddressResponse(addressId, "Name", "01", "VN", null, "A", null, "B", null, "C", "D", "1", true, null, null);
        when(mapper.toResponse(any())).thenReturn(mockResponse);

        List<AddressResponse> result = shippingAddressService.listAddresses("testuser");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(addressId);
    }

    // [Test] Exception path: User does not exist in the database
    @Test
    void listAddresses_shouldThrowWhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> shippingAddressService.listAddresses("unknown"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasFieldOrPropertyWithValue("errorCode", "USER_NOT_FOUND");
    }

    // [Test] Business rule: The first address of a user is automatically marked as default
    @Test
    void createAddress_shouldMakeDefaultWhenFirstAddressCreated() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(customerProfileRepository.findById(userId)).thenReturn(Optional.of(mockCustomer));
        when(addressRepository.countActiveByCustomerId(userId)).thenReturn(0L); // 0 active existing

        AddressCreateRequest req = new AddressCreateRequest("Receiver", "099", "VN", "PROV", "Prov", "DIST", "Dist", "WARD", "Ward", "Detail", "000", false);
        
        shippingAddressService.createAddress("testuser", req);

        ArgumentCaptor<ShippingAddress> addressCaptor = ArgumentCaptor.forClass(ShippingAddress.class);
        verify(addressRepository).save(addressCaptor.capture());
        
        ShippingAddress savedAddress = addressCaptor.getValue();
        assertThat(savedAddress.isDefault()).isTrue(); // implicitly made default because it's the first
        verify(addressRepository, never()).clearDefaultByCustomerId(userId);
    }

    // [Test] Business rule: Force-set new default address clears existing defaults
    @Test
    void createAddress_shouldClearPreviousDefaultWhenExplicitlySetToDefault() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(customerProfileRepository.findById(userId)).thenReturn(Optional.of(mockCustomer));
        when(addressRepository.countActiveByCustomerId(userId)).thenReturn(2L); 

        AddressCreateRequest req = new AddressCreateRequest("Receiver", "099", "VN", "PROV", "Prov", "DIST", "Dist", "WARD", "Ward", "Detail", "000", true);
        
        shippingAddressService.createAddress("testuser", req);

        ArgumentCaptor<ShippingAddress> addressCaptor = ArgumentCaptor.forClass(ShippingAddress.class);
        verify(addressRepository).clearDefaultByCustomerId(userId);
        verify(addressRepository).save(addressCaptor.capture());
        
        assertThat(addressCaptor.getValue().isDefault()).isTrue();
    }

    // [Test] Business rule: Partially updating an address updates properties cleanly
    @Test
    void updateAddress_shouldClearOldDefaultAndSetNew() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findActiveByIdAndCustomerId(addressId, userId)).thenReturn(Optional.of(mockAddress));
        
        AddressUpdateRequest req = new AddressUpdateRequest(null, null, null, null, null, null, null, null, null, null, null, true);
        
        shippingAddressService.updateAddress(addressId, "testuser", req);

        verify(addressRepository).clearDefaultByCustomerId(userId);
        assertThat(mockAddress.isDefault()).isTrue();
        verify(addressRepository).save(mockAddress);
    }

    // [Test] Business rule: Deleted default address automatically promotes the next active address to default
    @Test
    void deleteAddress_shouldAssignNewDefaultIfWasDefault() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        
        mockAddress.setDefault(true);
        when(addressRepository.findActiveByIdAndCustomerId(addressId, userId)).thenReturn(Optional.of(mockAddress));

        ShippingAddress nextAddress = new ShippingAddress(mockCustomer, "Next", "02", "P", "D", "W", "A");
        org.springframework.test.util.ReflectionTestUtils.setField(nextAddress, "id", UUID.randomUUID());
        nextAddress.setDefault(false);
        
        when(addressRepository.findActiveByCustomerId(userId)).thenReturn(List.of(mockAddress, nextAddress));

        shippingAddressService.deleteAddress(addressId, "testuser");

        assertThat(mockAddress.getDeletedAt()).isNotNull();
        assertThat(mockAddress.isDefault()).isFalse();
        verify(addressRepository).save(mockAddress);

        // verify next default was assigned
        assertThat(nextAddress.isDefault()).isTrue();
        verify(addressRepository).save(nextAddress);
    }
    
    @Test
    void getAddress_shouldReturnAddress() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findActiveByIdAndCustomerId(addressId, userId)).thenReturn(Optional.of(mockAddress));
        
        AddressResponse mockResponse = new AddressResponse(addressId, "Name", "01", "VN", null, "A", null, "B", null, "C", "D", "1", true, null, null);
        when(mapper.toResponse(any())).thenReturn(mockResponse);

        AddressResponse result = shippingAddressService.getAddress(addressId, "testuser");
        assertThat(result.id()).isEqualTo(addressId);
    }

    @Test
    void getAddress_shouldThrowWhenNotFoundOrNotOwned() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findActiveByIdAndCustomerId(addressId, userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> shippingAddressService.getAddress(addressId, "testuser"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasFieldOrPropertyWithValue("errorCode", "ADDRESS_NOT_FOUND");
    }

    @Test
    void updateAddress_shouldUpdatePropertiesCleanly() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findActiveByIdAndCustomerId(addressId, userId)).thenReturn(Optional.of(mockAddress));
        
        AddressUpdateRequest req = new AddressUpdateRequest("New Name", "new phone", "US", "PR", "Prov2", "DS", "Dist2", "WR", "Ward2", "New Detail", "999", null);
        
        shippingAddressService.updateAddress(addressId, "testuser", req);

        assertThat(mockAddress.getReceiverName()).isEqualTo("New Name");
        assertThat(mockAddress.getCountryCode()).isEqualTo("US");
        verify(addressRepository, never()).clearDefaultByCustomerId(any());
        verify(addressRepository).save(mockAddress);
    }

    @Test
    void setDefaultAddress_shouldClearOldAndSetNew() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findActiveByIdAndCustomerId(addressId, userId)).thenReturn(Optional.of(mockAddress));
        mockAddress.setDefault(false);
        
        shippingAddressService.setDefaultAddress(addressId, "testuser");

        verify(addressRepository).clearDefaultByCustomerId(userId);
        assertThat(mockAddress.isDefault()).isTrue();
        verify(addressRepository).save(mockAddress);
    }

    @Test
    void setDefaultAddress_shouldDoNothingIfAlreadyDefault() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(addressRepository.findActiveByIdAndCustomerId(addressId, userId)).thenReturn(Optional.of(mockAddress));
        mockAddress.setDefault(true);
        
        shippingAddressService.setDefaultAddress(addressId, "testuser");

        verify(addressRepository, never()).clearDefaultByCustomerId(any());
        verify(addressRepository, never()).save(any());
    }
}
