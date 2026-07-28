package com.re.ecommerce.modules.auth.service;

import com.re.ecommerce.modules.auth.dto.request.PasswordChangeRequest;
import com.re.ecommerce.modules.auth.dto.response.SessionResponse;

import java.util.List;
import java.util.UUID;

public interface AccountSecurityService {
    
    void changePassword(String currentUsername, PasswordChangeRequest request);
    
    List<SessionResponse> listMySessions(String currentUsername, UUID currentFamilyId);
    
    void revokeSession(String currentUsername, UUID sessionId);
    
    void revokeOtherSessions(String currentUsername, UUID currentFamilyId);
}
