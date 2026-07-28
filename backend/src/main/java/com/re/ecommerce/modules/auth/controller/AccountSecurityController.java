package com.re.ecommerce.modules.auth.controller;


import com.re.ecommerce.modules.auth.dto.request.PasswordChangeRequest;
import com.re.ecommerce.modules.auth.dto.response.SessionResponse;
import com.re.ecommerce.modules.auth.service.AccountSecurityService;
import com.re.ecommerce.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class AccountSecurityController {

    private final AccountSecurityService accountSecurityService;

    @PostMapping("/password-changes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PasswordChangeRequest request) {
        accountSecurityService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sessions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SessionResponse>> listMySessions(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID currentFamilyId = userDetails.familyId() != null ? UUID.fromString(userDetails.familyId()) : null;
        List<SessionResponse> sessions = accountSecurityService.listMySessions(userDetails.getUsername(), currentFamilyId);
        return ResponseEntity.ok(sessions);
    }

    @DeleteMapping("/sessions/{sessionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> revokeSession(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable UUID sessionId) {
        accountSecurityService.revokeSession(userDetails.getUsername(), sessionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sessions/revoke-others")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> revokeOtherSessions(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UUID currentFamilyId = userDetails.familyId() != null ? UUID.fromString(userDetails.familyId()) : null;
        accountSecurityService.revokeOtherSessions(userDetails.getUsername(), currentFamilyId);
        return ResponseEntity.noContent().build();
    }
}
