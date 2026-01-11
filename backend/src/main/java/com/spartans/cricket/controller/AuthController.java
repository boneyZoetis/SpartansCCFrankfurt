package com.spartans.cricket.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Hardcoded admin check for MVP
        if ("admin".equals(username) && "admin123".equals(password)) {
            return Map.of("status", "success", "token", "fake-jwt-token-for-demo");
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
