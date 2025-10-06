package com.moengage.movieflix.service;

import com.moengage.movieflix.dto.AuthRequest;
import com.moengage.movieflix.dto.AuthResponse;
import com.moengage.movieflix.dto.RefreshTokenRequest;
import com.moengage.movieflix.dto.RegisterRequest;
import com.moengage.movieflix.entity.RefreshToken;
import com.moengage.movieflix.entity.User;
import com.moengage.movieflix.exception.BadRequestException;
import com.moengage.movieflix.repository.RefreshTokenRepository;
import com.moengage.movieflix.repository.UserRepository;
import com.moengage.movieflix.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshTokenExpirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());

        String token = jwtUtil.generateToken(user.getUsername());
        RefreshToken refreshToken = createRefreshToken(user);

        return buildAuthResponse(user, token, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        log.info("User login attempt: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername());
        
        // Delete old refresh token if exists
        refreshTokenRepository.findByUser(user).ifPresent(refreshTokenRepository::delete);
        
        RefreshToken refreshToken = createRefreshToken(user);

        log.info("User logged in successfully: {}", user.getUsername());

        return buildAuthResponse(user, token, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refresh token request received");

        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Refresh token not found"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token has expired");
        }

        User user = refreshToken.getUser();
        String newToken = jwtUtil.generateToken(user.getUsername());

        log.info("Token refreshed successfully for user: {}", user.getUsername());

        return buildAuthResponse(user, newToken, refreshToken.getToken());
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpirationMs))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    private AuthResponse buildAuthResponse(User user, String token, String refreshToken) {
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}

