package com.flogin.service;

import com.flogin.dto.login.LoginRequestDTO;
import com.flogin.dto.login.LoginResponseDTO;
import com.flogin.dto.login.RegisterRequestDTO;
import com.flogin.dto.login.RegisterResponseDTO;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class AuthService {
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    JwtService jwtService;
    AuthenticationManager authenticationManager;
    UserDetailsService userDetailsService;

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByUsername(loginRequestDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Tài khoản không tồn tại"));
        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Mật khẩu không đúng");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getUsername());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getUsername(), loginRequestDTO.getPassword()));
        String accessToken = jwtService.generateToken(userDetails);
        return new LoginResponseDTO(accessToken);
    }

    public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        if (userRepository.existsByUsername(registerRequestDTO.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        User user = new User(registerRequestDTO.getFullName(), registerRequestDTO.getUsername(), registerRequestDTO.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return new RegisterResponseDTO(registerRequestDTO.getFullName(), registerRequestDTO.getUsername());
    }
    public User getUserByUsername(String username){
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Tai khoan khong ton tai"));
    }
}
