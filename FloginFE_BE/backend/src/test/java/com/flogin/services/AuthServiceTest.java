package com.flogin.services;

import com.flogin.BaseFake.BaseFakeUserRepository;
import com.flogin.dto.login.LoginRequestDTO;
import com.flogin.dto.login.LoginResponseDTO;
import com.flogin.dto.login.RegisterRequestDTO;
import com.flogin.dto.login.RegisterResponseDTO;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.AuthService;
import com.flogin.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Login Service Unit tests")
public class AuthServiceTest {
    private AuthService authService;

    private UserRepository fakeRepository;
    private PasswordEncoder fakeEncoder;
    private JwtService fakeJwtService;
    private AuthenticationManager fakeAuthManager;
    private UserDetailsService fakeUserDetailsService;

    @BeforeEach
    void setUp(){
        fakeEncoder = new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString() + "_encoded";
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return ((rawPassword.toString() + "_encoded").equals(encodedPassword));
            }
        };
        fakeAuthManager = new AuthenticationManager() {
            @Override
            public Authentication authenticate(Authentication authentication) throws AuthenticationException {
                // Luôn trả về thành công cho đơn giản, hoặc check logic tùy ý
                return new UsernamePasswordAuthenticationToken(authentication.getPrincipal(), authentication.getCredentials());
            }
        };
        fakeJwtService = new JwtService() {
            @Override
            public String generateToken(UserDetails userDetails) {
                return "fake-jwt-token-123456"; // Luôn trả về chuỗi này
            }
        };
        fakeUserDetailsService = new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return org.springframework.security.core.userdetails.User
                        .withUsername(username).password("password").authorities("USER").build();
            }
        };
        fakeRepository = new BaseFakeUserRepository() {
            @Override
            public Optional<User> findByUsername(String username) {
                if ("admin123".equals(username)) {
                    User u = new User();
                    u.setUsername("admin123");
                    u.setPassword("admin123_encoded");
                    return Optional.of(u);
                }
                return Optional.empty();
            }
            @Override
            public boolean existsByUsername(String username) {
                return "admin123".equals(username);
            }
            @Override
            public <S extends User> S save(S entity) {
                return entity;
            }
        };
        authService = new AuthService(fakeEncoder, fakeRepository, fakeJwtService, fakeAuthManager, fakeUserDetailsService);
    }
    @Test
    @DisplayName("TC1: Login thanh cong voi credentials hop le")
    void testLoginSuccess(){
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("admin123", "admin123");
        LoginResponseDTO loginResponseDTO = authService.login(loginRequestDTO);
        assertNotNull(loginResponseDTO.getAccessToken());
        assertEquals("Bearer Token", loginResponseDTO.getHeader());
    }

    @Test
    @DisplayName("TC2: Login that bai voi username khong ton tai")
    void testLoginFailure(){
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("notFoundUser", "admin123");
        UsernameNotFoundException ex = assertThrows(
                UsernameNotFoundException.class,
                () -> authService.login(loginRequestDTO)
        );
        assertEquals("Tài khoản không tồn tại", ex.getMessage());
    }
    @Test
    @DisplayName("TC3: Login that bai voi password sai")
    void testLoginFailure_WrongPassword(){
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("admin123", "wrongPassword123");
        BadCredentialsException ex = assertThrows(BadCredentialsException.class,
                () -> authService.login(loginRequestDTO));
        assertEquals("Mật khẩu không đúng", ex.getMessage());
    }
    @Test
    @DisplayName("TC4: Register thanh cong")
    void testRegister_Success(){
        RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO(
                "Hoang Quy",
                "hoang123",
                "hoang123"
        );
        RegisterResponseDTO result = authService.register(registerRequestDTO);
        assertNotNull(result);
    }
    @Test
    @DisplayName("TC5: Register that bai voi username da ton tai")
    void testRegister_UsernameExists(){
        RegisterRequestDTO registerRequestDTO = new RegisterRequestDTO(
                "Hoang Quy",
                "admin123",
                "hoang123"
        );
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequestDTO));
        assertEquals("Tên đăng nhập đã tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("TC6: Lay user bang username thanh cong")
    void testGetUserByUsername(){
        User user = authService.getUserByUsername("admin123");
        assertNotNull(user);
    }

}