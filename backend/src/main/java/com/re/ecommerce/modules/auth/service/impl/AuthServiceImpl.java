package com.re.ecommerce.modules.auth.service.impl;

import com.re.ecommerce.modules.auth.dto.request.LoginRequest;
import com.re.ecommerce.modules.auth.dto.request.RegisterRequest;
import com.re.ecommerce.modules.auth.dto.response.AuthResponse;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.service.AuthService;
import com.re.ecommerce.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User(
                request.username(),
                request.email(),
                passwordEncoder.encode(request.password()),
                "USER"
        );
        
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        if (!user.isActive()) {
            throw new IllegalArgumentException("User account is deactivated");
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}
