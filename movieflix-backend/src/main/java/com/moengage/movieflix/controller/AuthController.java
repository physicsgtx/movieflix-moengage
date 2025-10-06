package com.moengage.movieflix.controller;

import com.moengage.movieflix.dto.*;
import com.moengage.movieflix.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(
            summary = "Register a new user",
            description = "Create a new user account. Returns JWT tokens for immediate authentication."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = com.moengage.movieflix.dto.ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or username/email already exists",
                    content = @Content(schema = @Schema(implementation = com.moengage.movieflix.dto.ApiResponse.class)))
    })
    @SecurityRequirements // No authentication required
    public ResponseEntity<com.moengage.movieflix.dto.ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request for username: {}", request.getUsername());
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(com.moengage.movieflix.dto.ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticate user and receive JWT tokens. Use default credentials: admin/admin123 or user/user123"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(schema = @Schema(implementation = com.moengage.movieflix.dto.ApiResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = com.moengage.movieflix.dto.ApiResponse.class)))
    })
    @SecurityRequirements // No authentication required
    public ResponseEntity<com.moengage.movieflix.dto.ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        log.info("Login request for username: {}", request.getUsername());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(com.moengage.movieflix.dto.ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(
            summary = "Refresh access token",
            description = "Get a new access token using refresh token. Refresh tokens are valid for 7 days."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully",
                    content = @Content(schema = @Schema(implementation = com.moengage.movieflix.dto.ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid or expired refresh token",
                    content = @Content(schema = @Schema(implementation = com.moengage.movieflix.dto.ApiResponse.class)))
    })
    @SecurityRequirements // No authentication required
    public ResponseEntity<com.moengage.movieflix.dto.ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request");
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(com.moengage.movieflix.dto.ApiResponse.success("Token refreshed successfully", response));
    }
}

