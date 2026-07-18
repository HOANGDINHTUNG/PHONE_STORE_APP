package com.re.ecommerce.modules.auth.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.dto.request.UserProfileUpdateRequest;
import com.re.ecommerce.modules.auth.dto.request.UserUpdateAdminRequest;
import com.re.ecommerce.modules.auth.dto.response.UserResponse;
import com.re.ecommerce.modules.auth.entity.AccountStatus;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerProfileRepository customerProfileRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private CustomerProfile testProfile;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "hash", "USER");
        ReflectionTestUtils.setField(testUser, "id", UUID.randomUUID());
        testUser.setPhone("0901234567");
        testUser.setAccountStatus(AccountStatus.ACTIVE);
        testUser.setActive(true);

        testProfile = new CustomerProfile(testUser, "CUST-100");
        testProfile.setFullName("John Doe");
        testProfile.setGender("MALE");
        testProfile.setDateOfBirth(LocalDate.of(1990, 1, 1));
        testProfile.setMarketingOptIn(true);
    }

    @Test
    void getCurrentUserProfile_shouldReturnUserResponse_whenUserAndProfileExist() {
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));

        UserResponse response = userService.getCurrentUserProfile(testUser.getUsername());

        assertThat(response).isNotNull();
        assertThat(response.username()).isEqualTo(testUser.getUsername());
        assertThat(response.customerCode()).isEqualTo("CUST-100");
        assertThat(response.fullName()).isEqualTo("John Doe");
    }

    @Test
    void getCurrentUserProfile_shouldThrowResourceNotFound_whenUserDoesNotExist() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> userService.getCurrentUserProfile("unknown"));
    }

    @Test
    void updateCurrentUserProfile_shouldUpdateAndReturn_whenValidRequest() {
        // UserProfileUpdateRequest(phone, avatarUrl, fullName, dateOfBirth, gender)
        UserProfileUpdateRequest request = new UserProfileUpdateRequest(
                "0909999999", "new-avatar.jpg", "Jane Doe", LocalDate.of(1995, 5, 5), "FEMALE"
        );

        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));
        when(userRepository.existsByPhone(request.phone())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));
        when(customerProfileRepository.save(any(CustomerProfile.class))).thenReturn(testProfile);

        UserResponse response = userService.updateCurrentUserProfile(testUser.getUsername(), request);

        assertThat(response).isNotNull();
        assertThat(testUser.getPhone()).isEqualTo("0909999999");
        assertThat(testUser.getAvatarUrl()).isEqualTo("new-avatar.jpg");
        assertThat(testProfile.getFullName()).isEqualTo("Jane Doe");
        assertThat(testProfile.getGender()).isEqualTo("FEMALE");

        verify(userRepository).save(testUser);
        verify(customerProfileRepository).save(testProfile);
    }

    @Test
    void updateCurrentUserProfile_shouldThrowConflict_whenPhoneAlreadyExists() {
        // phone is different from current → check conflict
        UserProfileUpdateRequest request = new UserProfileUpdateRequest(
                "0909999999", null, null, null, null
        );

        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));
        when(userRepository.existsByPhone(request.phone())).thenReturn(true);

        BusinessConflictException ex = assertThrows(BusinessConflictException.class,
                () -> userService.updateCurrentUserProfile(testUser.getUsername(), request));

        assertThat(ex.getErrorCode()).isEqualTo("PHONE_EXISTS");
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateCurrentUserProfile_shouldSkipPhoneUpdate_whenPhoneIsSame() {
        // phone is the same as existing → no conflict check
        UserProfileUpdateRequest request = new UserProfileUpdateRequest(
                testUser.getPhone(), null, null, null, null
        );

        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));
        when(customerProfileRepository.save(any(CustomerProfile.class))).thenReturn(testProfile);

        userService.updateCurrentUserProfile(testUser.getUsername(), request);

        verify(userRepository, never()).existsByPhone(anyString());
        verify(userRepository).save(testUser);
    }

    @Test
    void listUsers_shouldReturnFilteredUsers() {
        User user2 = new User("admin", "admin@test.com", "hash", "ADMIN");
        ReflectionTestUtils.setField(user2, "id", UUID.randomUUID());
        user2.setAccountStatus(AccountStatus.LOCKED);

        when(userRepository.findAll()).thenReturn(List.of(testUser, user2));
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));
        when(customerProfileRepository.findById(user2.getId())).thenReturn(Optional.empty());

        List<UserResponse> resultAll = userService.listUsers(null, null);
        assertThat(resultAll).hasSize(2);

        List<UserResponse> resultStatus = userService.listUsers(null, AccountStatus.ACTIVE);
        assertThat(resultStatus).hasSize(1);
        assertThat(resultStatus.get(0).username()).isEqualTo("testuser");

        List<UserResponse> resultKeyword = userService.listUsers("admin", null);
        assertThat(resultKeyword).hasSize(1);
        assertThat(resultKeyword.get(0).username()).isEqualTo("admin");

        List<UserResponse> resultEmail = userService.listUsers("test@example", null);
        assertThat(resultEmail).hasSize(1);
    }

    @Test
    void getUserById_shouldReturnUser_whenExists() {
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));

        UserResponse response = userService.getUserById(testUser.getId());
        assertThat(response).isNotNull();
    }

    @Test
    void getUserById_shouldThrowNotFound_whenDoesNotExist() {
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(UUID.randomUUID()));
    }

    @Test
    void adminUpdateUser_shouldUpdateAndReturn_whenValid() {
        // UserUpdateAdminRequest(fullName, phone, avatarUrl)
        UserUpdateAdminRequest request = new UserUpdateAdminRequest("Admin Update", "0988888888", "admin-avatar.jpg");

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.existsByPhone(request.phone())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));
        when(customerProfileRepository.save(any(CustomerProfile.class))).thenReturn(testProfile);

        UserResponse response = userService.adminUpdateUser(testUser.getId(), request);

        assertThat(testUser.getPhone()).isEqualTo("0988888888");
        assertThat(testProfile.getFullName()).isEqualTo("Admin Update");
        verify(userRepository).save(testUser);
    }

    @Test
    void adminUpdateUser_shouldThrowConflict_whenPhoneExists() {
        UserUpdateAdminRequest request = new UserUpdateAdminRequest(null, "0988888888", null);

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.existsByPhone(request.phone())).thenReturn(true);

        assertThrows(BusinessConflictException.class,
                () -> userService.adminUpdateUser(testUser.getId(), request));
    }

    @Test
    void adminUpdateUser_shouldSkipPhone_whenPhoneIsSameAsCurrent() {
        // Same phone → no conflict check
        UserUpdateAdminRequest request = new UserUpdateAdminRequest(null, testUser.getPhone(), null);

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.empty());

        userService.adminUpdateUser(testUser.getId(), request);
        verify(userRepository, never()).existsByPhone(anyString());
    }

    @Test
    void changeUserStatus_shouldActivateUser_whenStatusIsActive() {
        testUser.setAccountStatus(AccountStatus.LOCKED);
        testUser.setLockedUntil(LocalDateTime.now().plusDays(1));
        testUser.setFailedLoginCount(5);
        testUser.setActive(false);

        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));

        userService.changeUserStatus(testUser.getId(), AccountStatus.ACTIVE);

        assertThat(testUser.getAccountStatus()).isEqualTo(AccountStatus.ACTIVE);
        assertThat(testUser.getLockedUntil()).isNull();
        assertThat(testUser.getFailedLoginCount()).isZero();
        assertThat(testUser.isActive()).isTrue();
    }

    @Test
    void changeUserStatus_shouldDisableUser_whenStatusIsDisabled() {
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(customerProfileRepository.findById(testUser.getId())).thenReturn(Optional.of(testProfile));

        userService.changeUserStatus(testUser.getId(), AccountStatus.DISABLED);

        assertThat(testUser.getAccountStatus()).isEqualTo(AccountStatus.DISABLED);
        assertThat(testUser.isActive()).isFalse();
    }
}
