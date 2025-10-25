package com.flogin.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody String credentials) {
        // TODO: Implement login logic
        return "Login endpoint";
    }
}
