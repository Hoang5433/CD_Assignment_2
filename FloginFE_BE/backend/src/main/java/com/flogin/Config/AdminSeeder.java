package com.flogin.Config;

import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByUsername("admin123").orElseGet(() -> {
                User admin = new User();
                admin.setUsername("admin123");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin");
                return userRepository.save(admin);
            });
        };
    }
}
