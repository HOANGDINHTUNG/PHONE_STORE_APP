package com.re.ecommerce.modules.auth.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.auth.dto.request.UserProfileUpdateRequest;
import com.re.ecommerce.modules.auth.dto.response.UserResponse;
import com.re.ecommerce.modules.auth.entity.AccountStatus;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Người dùng không tồn tại."));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateCurrentUserProfile(String username, UserProfileUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Người dùng không tồn tại."));

        if (request.phone() != null && !request.phone().isBlank()) {
            if (!request.phone().equals(user.getPhone())) {
                if (userRepository.existsByPhone(request.phone())) { // Needs method on UserRepository, fallback to a query check
                    throw new BusinessConflictException("PHONE_EXISTS", "Số điện thoại đã được đăng ký.");
                }
                user.setPhone(request.phone());
                user.setPhoneVerifiedAt(null);
            }
        }

        if (request.avatarUrl() != null) {
            user.setAvatarUrl(request.avatarUrl());
        }

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> listUsers(String keyword, AccountStatus status) {
        List<User> users = userRepository.findAll(); // Optimization later for pagination and querying
        return users.stream()
                .filter(u -> status == null || u.getAccountStatus() == status)
                .filter(u -> keyword == null || keyword.isEmpty() ||
                        u.getUsername().toLowerCase().contains(keyword.toLowerCase()) ||
                        u.getEmail().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Người dùng không tồn tại."));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse changeUserStatus(UUID userId, AccountStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND", "Người dùng không tồn tại."));

        user.setAccountStatus(status);
        if (status == AccountStatus.ACTIVE) {
            user.setLockedUntil(null);
            user.setFailedLoginCount(0);
            user.setActive(true);
        } else if (status == AccountStatus.DISABLED) {
            user.setActive(false);
        }

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getAccountStatus().name(),
                user.getEmailVerifiedAt(),
                user.getPhoneVerifiedAt(),
                user.getLastLoginAt(),
                user.getCreatedAt()
        );
    }
}
