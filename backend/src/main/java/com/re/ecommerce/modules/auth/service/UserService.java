package com.re.ecommerce.modules.auth.service;

import com.re.ecommerce.modules.auth.dto.request.UserProfileUpdateRequest;
import com.re.ecommerce.modules.auth.dto.response.UserResponse;
import com.re.ecommerce.modules.auth.entity.AccountStatus;

import java.util.List;
import java.util.UUID;

public interface UserService {
    UserResponse getCurrentUserProfile(String username);
    UserResponse updateCurrentUserProfile(String username, UserProfileUpdateRequest request);
    List<UserResponse> listUsers(String keyword, AccountStatus status);
    UserResponse getUserById(UUID userId);
    UserResponse changeUserStatus(UUID userId, AccountStatus status);
}
