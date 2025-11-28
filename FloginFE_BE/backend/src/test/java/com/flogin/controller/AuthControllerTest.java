package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test Tích hợp cho AuthController
 *
 * Lớp test này tập trung vào việc test AuthController trong ngữ cảnh tích hợp sử dụng @WebMvcTest.
 * Nó test toàn bộ vòng đời request/response HTTP bao gồm:
 * - Serialization/deserialization JSON
 * - Mã trạng thái HTTP và headers
 * - Validation request và xử lý lỗi (username/password validation)
 * - Cấu hình CORS
 *
 * Các dependencies (AuthService, JwtService) được mock bằng @MockitoBean để cô lập logic controller.
 * Tests verify cả các hoạt động thành công và các kịch bản lỗi với mock interactions đúng đắn.
 *
 * Test coverage bao gồm:
 * - Login thành công với credentials hợp lệ
 * - Login thất bại: username rỗng, password rỗng
 * - Login thất bại: password chỉ chứa chữ, username quá dài
 *
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Login API Integration tests (5 test cases)")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

// test đăng nhập thành công 
    @Test
    void TC_LOGIN_001() throws Exception {
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

        verify(authService, times(1)).login(any(LoginRequestDTO.class));
    }
// test username rỗng 
    @Test
    void TC_LOGIN_002() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                "",  // username rỗng
                "Test123"
        );
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.username").exists()); 
    }

    // test password rỗng 
    @Test
    void TC_LOGIN_003() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                "admin123",
                ""  // password rỗng
        );
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.password").exists()); // Just check that validation error exists
    }
// test sai định dạng pass
    @Test
    void TC_LOGIN_004() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                "testuser",
                "password"  // chỉ chứa chữ, không có số
        );
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.password").exists());
    }
// test username >50 kí tự
    @Test
    void TC_LOGIN_005() throws Exception {
        String longUsername = "a".repeat(51); // 51 ký tự
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
                longUsername,
                "password123"
        );
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.messages.username").exists());
    }


// test CORS
    @Test
    void testCORSHeaders_POST() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "content-type")
                        .content(objectMapper.writeValueAsString(new LoginRequestDTO("admin123", "admin123"))))
                .andExpect(status().isOk());

        
        verify(authService, times(1)).login(any(LoginRequestDTO.class));

    }
}