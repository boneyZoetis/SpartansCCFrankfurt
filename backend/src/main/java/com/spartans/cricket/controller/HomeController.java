package com.spartans.cricket.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class HomeController {

    @GetMapping("/api/welcome")
    public Map<String, String> welcome() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to Spartans Cricket Club API");
        response.put("club", "Spartans Cricket Club");
        return response;
    }

    @GetMapping("/api/health")
    public String healthCheck() {
        return "OK";
    }
}
