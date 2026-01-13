package com.spartans.cricket.controller;

import com.spartans.cricket.model.JoinRequest;
import com.spartans.cricket.repository.JoinRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/join")
@CrossOrigin(origins = "*") // Allow global access
public class JoinRequestController {

    @Autowired
    private JoinRequestRepository repository;

    @PostMapping
    public JoinRequest submitRequest(@RequestBody JoinRequestDTO request) {
        // Honeypot check
        if (request.getWebsite() != null && !request.getWebsite().isEmpty()) {
            // Robotic attack detected. Log and ignore.
            System.out.println("Bot detected via honeypot: " + request.getName());
            return new JoinRequest(); // Return empty success
        }

        JoinRequest entity = new JoinRequest();
        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setRole(request.getRole());
        entity.setExperience(request.getExperience());
        entity.setMessage(request.getMessage());
        entity.setLegalConsent(request.isLegalConsent());

        return repository.save(entity);
    }

    @GetMapping
    public List<JoinRequest> getAllRequests(@RequestParam(required = false) String status) {
        if (status != null) {
            return repository.findByStatusOrderByCreatedAtDesc(status);
        }
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/{id}/process")
    public JoinRequest markProcessed(@PathVariable Long id) {
        JoinRequest req = repository.findById(id).orElseThrow();
        req.setStatus("PROCESSED");
        return repository.save(req);
    }

    // DTO to handle honeypot field which is not in Entity
    public static class JoinRequestDTO extends JoinRequest {
        private String website; // Honeypot field

        public String getWebsite() {
            return website;
        }

        public void setWebsite(String website) {
            this.website = website;
        }
    }
}
