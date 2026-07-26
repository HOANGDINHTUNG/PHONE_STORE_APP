package com.re.ecommerce.modules.auth.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.re.ecommerce.modules.auth.dto.request.UserProfileUpdateRequest;
import com.re.ecommerce.modules.auth.dto.response.UserResponse;
import com.re.ecommerce.modules.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "2. Profile")
@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponse> getCurrentProfile(Authentication authentication) {
        String username = authentication.getName();

        return ResponseEntity.ok(userService.getCurrentUserProfile(username));
    }

    @PatchMapping
    public ResponseEntity<UserResponse> updateCurrentProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        String username = authentication.getName();

        return ResponseEntity.ok(userService.updateCurrentUserProfile(username, request));
    }
}
