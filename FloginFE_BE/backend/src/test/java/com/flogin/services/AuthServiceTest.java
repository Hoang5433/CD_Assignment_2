//package com.flogin.services;
//
//import com.flogin.dto.login.LoginRequestDTO;
//import com.flogin.dto.login.LoginResponseDTO;
//import com.flogin.entity.User;
//import com.flogin.repository.UserRepository;
//import com.flogin.service.AuthService;
//import com.flogin.service.JwtService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.when;
//
//@DisplayName("Login Service Unit tests")
//class AuthServiceTest {
//
//    @InjectMocks
//    private AuthService authService;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//    @Mock
//    private UserRepository userRepository;
//    @Mock
//    private JwtService jwtService;
//    @Mock
//    private UserDetailsService userDetailsService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    @DisplayName("TC1: Login thanh cong voi credentials hop le")
//    void testLoginSuccess() {
//        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
//                "admin123",
//                "admin123"
//        );
//        User user = new User("Admin", "admin123", "admin123");
//        when(userRepository.findByUsername("admin123")).thenReturn(Optional.of(user));
//        when(passwordEncoder.matches("admin123", user.getPassword())).thenReturn(true);
//
//        UserDetails userDetails = mock(UserDetails.class);
//        when(userDetailsService.loadUserByUsername("admin123")).thenReturn(userDetails);
//        when(jwtService.generateToken(userDetails)).thenReturn("fake-jwt-token");
//
//        LoginResponseDTO loginResponseDTO = authService.login(loginRequestDTO);
//        assertNotNull(loginResponseDTO.getAccessToken());
//        assertEquals("Bearer Token", loginResponseDTO.getHeader());
//    }
//
//    @Test
//    @DisplayName("TC2: Login that bai voi username khong ton tai")
//    void testLoginFailure_UsernameNotFound() {
//        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
//                "unknownUser",
//                "nomkimchi"
//        );
//        when(userRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());
//        UsernameNotFoundException ex = assertThrows(
//                UsernameNotFoundException.class,
//                () -> authService.login(loginRequestDTO)
//        );
//        assertEquals("Tài khoản không tồn tại", ex.getMessage());
//    }
//
//    @Test
//    @DisplayName("TC3: Login that bai voi password sai")
//    void testLoginFailure_WrongPassword() {
//        LoginRequestDTO loginRequestDTO = new LoginRequestDTO(
//                "admin123",
//                "wrongPassword"
//        );
//        User user = new User("Admin", "admin123", "admin123");
//        when(userRepository.findByUsername("admin123")).thenReturn(Optional.of(user));
//        when(passwordEncoder.matches("wrongPassword", user.getPassword())).thenReturn(false);
//        BadCredentialsException ex = assertThrows(BadCredentialsException.class,
//                () -> authService.login(loginRequestDTO));
//        assertEquals("Mật khẩu không đúng", ex.getMessage());
//    }
//}