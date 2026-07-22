package com.re.ecommerce.modules.auth.controller;

import com.re.ecommerce.modules.auth.dto.request.UserProfileUpdateRequest;
import com.re.ecommerce.modules.auth.dto.response.UserResponse;
import com.re.ecommerce.modules.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserResponse> getCurrentProfile(Authentication authentication) {
        String username = authentication.getName();
        log.debug("Fetching self profile details for username: {}", username);
        return ResponseEntity.ok(userService.getCurrentUserProfile(username));
    }

    @PatchMapping
    public ResponseEntity<UserResponse> updateCurrentProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        String username = authentication.getName();
        log.info("Request actively processing profile update for username: {}", username);
        return ResponseEntity.ok(userService.updateCurrentUserProfile(username, request));
    }
}
