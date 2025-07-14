package com.healapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.healapp.config.JwtTokenProvider;
import com.healapp.dto.JwtResponse;
import com.healapp.dto.LoginRequest;

import com.healapp.dto.RefreshTokenRequest;
import com.healapp.dto.ApiResponse;
import com.healapp.model.UserDtls;
import com.healapp.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Sử dụng UserService để xác thực (hỗ trợ cả username và email)
            var loginResponse = userService.login(loginRequest);

            if (!loginResponse.isSuccess()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<String>(false, loginResponse.getMessage()));
            }

            // Lấy thông tin user từ response
            UserDtls user = userService.getUserByUsername(loginResponse.getData().getUsername());

            // Tạo authentication object cho JWT token
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername())
                    .password("") // Không cần password cho token generation
                    .authorities("ROLE_" + user.getRoleName())
                    .build();

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            // Tạo JWT tokens
            String accessToken = tokenProvider.generateAccessToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

            JwtResponse jwtResponse = new JwtResponse(
                    accessToken,
                    refreshToken,
                    "Bearer", // tokenType
                    14400L, // expiresIn (4 hours in seconds)
                    user.getId(), // userId
                    user.getUsername(),
                    user.getEmail(),
                    user.getRoleName());

            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            log.error("Authentication failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<String>(false, "Invalid username/email or password"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();
            if (!tokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<String>(false, "Invalid refresh token"));
            }

            String username = tokenProvider.getUsernameFromToken(refreshToken);
            UserDtls user = userService.getUserByUsername(username);

            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<String>(false, "User not found"));
            } // Create a proper UserDetails object for authentication
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername())
                    .password("") // Not needed for token generation
                    .authorities("ROLE_" + user.getRoleName())
                    .build();

            // Create authentication object for new access token
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            String newAccessToken = tokenProvider.generateAccessToken(authentication);
            String newRefreshToken = tokenProvider.generateRefreshToken(username);
            JwtResponse jwtResponse = new JwtResponse(
                    newAccessToken,
                    newRefreshToken,
                    "Bearer", // tokenType
                    14400L, // expiresIn (4 hours in seconds)
                    user.getId(), // userId
                    user.getUsername(),
                    user.getEmail(),
                    user.getRoleName());

            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<String>(false, "Token refresh failed"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // For stateless JWT, logout is handled on the client side
        // by removing the token from storage
        return ResponseEntity.ok(new ApiResponse<String>(true, "Logout successful"));
    }
}
