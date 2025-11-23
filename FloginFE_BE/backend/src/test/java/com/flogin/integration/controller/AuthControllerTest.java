package com.flogin.integration.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.controller.AuthController;
import com.flogin.dto.login.LoginRequestDTO;
import com.flogin.dto.login.LoginResponseDTO;
import com.flogin.service.AuthService;
import com.flogin.service.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Login API Integration tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;


    @Test
    void testLoginSuccess() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                "admin123",
                "admin123"
        );
        LoginResponseDTO mockResponse = new LoginResponseDTO(
                "fake_jwt_token"
        );
        when(authService.login(any(LoginRequestDTO.class)))
                .thenReturn(mockResponse);

        when(jwtService.validateToken(any(), any())).thenReturn(true);
        when(jwtService.getUsernameFromToken(any())).thenReturn("admin123");
        when(authService.login(any(LoginRequestDTO.class))).thenReturn(mockResponse);
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists()
                );
    }

    @Test
    void testLoginFailed_UsernameNotFound() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                "unknownUser",
                "admin123" // khong co ca chu va so
        );
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new UsernameNotFoundException("Tài khoản không tồn tại"));
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(jsonPath("$.message").value("Tài khoản không tồn tại"))
                .andExpect(status().isNotFound());  // mapping UsernameNotFoundException -> 404

    }

    @Test
    void testLoginFailed_PasswordIncorrect() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                "admin123",
                "wrongPassword123"
        );
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new BadCredentialsException("Mật khẩu không đúng"));
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(jsonPath("$.message").value("Mật khẩu không đúng"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testLoginFailed_InvalidPassword() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                "admin123",
                "221123"
        );
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.password").value(
                        "Mật khẩu phải có cả chữ và số"
                ));
    }

    @Test
    void testCORSHeaders_POST() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "content-type")
                        .content(objectMapper.writeValueAsString(new LoginRequestDTO("admin123", "admin123"))))
                .andExpect(status().isOk());

    }
}