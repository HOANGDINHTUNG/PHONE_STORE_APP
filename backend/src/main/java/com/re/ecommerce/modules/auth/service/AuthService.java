package com.re.ecommerce.modules.auth.service;

import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
