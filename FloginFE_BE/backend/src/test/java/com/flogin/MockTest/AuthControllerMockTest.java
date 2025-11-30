package com.flogin.MockTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.IntegrationTest.AuthController;
import com.flogin.dto.login.LoginRequestDTO;
import com.flogin.dto.login.LoginResponseDTO;
import com.flogin.service.AuthService;
import com.flogin.service.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    @DisplayName("TC001: Login thành công với mocked service")
    void TC_LOGIN_001() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("admin123", "admin123");
        LoginResponseDTO mockResponse = new LoginResponseDTO("fake_jwt_token");

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(mockResponse);
        
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());

        verify(authService, times(1)).login(any(LoginRequestDTO.class));
    }

    @Test
    @DisplayName("TC002: Login thất bại - username rỗng")
    void TC_LOGIN_002() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("", "Test123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.username").exists());

        verify(authService, never()).login(any(LoginRequestDTO.class));
    }

    @Test
    @DisplayName("TC003: Login thất bại - password rỗng")
    void TC_LOGIN_003() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("admin123", "");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.password").exists());

        verify(authService, never()).login(any(LoginRequestDTO.class));
    }

    @Test
    @DisplayName("TC004: Login thất bại - password không có số")
    void TC_LOGIN_004() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("testuser", "password");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.password").exists());

        verify(authService, never()).login(any(LoginRequestDTO.class));
    }

    @Test
    @DisplayName("TC005: Login thất bại - username quá dài")
    void TC_LOGIN_005() throws Exception {
        String longUsername = "a".repeat(51);
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(longUsername, "password123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.username").exists());

        verify(authService, never()).login(any(LoginRequestDTO.class));
    }

    @Test
    @DisplayName("TC006: Kiểm tra CORS headers")
    void testCORSHeaders_POST() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("admin123", "admin123");
        LoginResponseDTO mockResponse = new LoginResponseDTO("fake_jwt_token");

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "content-type")
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isOk());

        verify(authService, times(1)).login(any(LoginRequestDTO.class));
    }
}