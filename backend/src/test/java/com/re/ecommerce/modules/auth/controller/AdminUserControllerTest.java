package com.re.ecommerce.modules.auth.controller;

import com.re.ecommerce.modules.auth.dto.request.UserUpdateAdminRequest;
import com.re.ecommerce.modules.auth.dto.response.UserResponse;
import com.re.ecommerce.modules.auth.entity.AccountStatus;
import com.re.ecommerce.modules.auth.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminUserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AdminUserController adminUserController;

    private UserResponse makeUserResponse(UUID id, String username, String status) {
        return new UserResponse(id, username, username + "@test.com",
                null, null, "USER", status,
                null, null, null, null, null, null, null, null, null);
    }

    @Test
    void listUsers_shouldReturnList() {
        UUID id = UUID.randomUUID();
        when(userService.listUsers("test", AccountStatus.ACTIVE))
                .thenReturn(List.of(makeUserResponse(id, "test", "ACTIVE")));

        ResponseEntity<List<UserResponse>> response = adminUserController.listUsers("test", AccountStatus.ACTIVE);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).username()).isEqualTo("test");
    }

    @Test
    void getUser_shouldReturnUser() {
        UUID id = UUID.randomUUID();
        when(userService.getUserById(id)).thenReturn(makeUserResponse(id, "test", "ACTIVE"));

        ResponseEntity<UserResponse> response = adminUserController.getUser(id);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().username()).isEqualTo("test");
    }

    @Test
    void updateUser_shouldReturnUpdatedUser() {
        UUID id = UUID.randomUUID();
        UserUpdateAdminRequest req = new UserUpdateAdminRequest("Updated Name", null, null);
        when(userService.adminUpdateUser(id, req)).thenReturn(makeUserResponse(id, "updated", "ACTIVE"));

        ResponseEntity<UserResponse> response = adminUserController.updateUser(id, req);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().username()).isEqualTo("updated");
    }

    @Test
    void changeUserStatus_shouldReturnUpdatedUser() {
        UUID id = UUID.randomUUID();
        when(userService.changeUserStatus(id, AccountStatus.DISABLED))
                .thenReturn(makeUserResponse(id, "test", "DISABLED"));

        ResponseEntity<UserResponse> response = adminUserController.changeUserStatus(id, AccountStatus.DISABLED);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        assertThat(response.getBody().accountStatus()).isEqualTo("DISABLED");
    }
}
