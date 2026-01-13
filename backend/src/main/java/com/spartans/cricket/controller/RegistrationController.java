package com.spartans.cricket.controller;

import com.spartans.cricket.model.Registration;
import com.spartans.cricket.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/register")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody Registration registration,
            @RequestParam(defaultValue = "false") boolean force) {
        if (!force) {
            long count = registrationRepository.countByEmailOrPhoneNumber(registration.getEmail(),
                    registration.getPhoneNumber());
            if (count > 0) {
                return ResponseEntity.status(409).body(Map.of(
                        "duplicate", true,
                        "count", count,
                        "message", "Duplicate details found"));
            }
        }
        return ResponseEntity.ok(registrationRepository.save(registration));
    }

    @GetMapping
    public java.util.List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    @PutMapping("/{id}/process")
    public Registration processRegistration(@PathVariable Long id) {
        return registrationRepository.findById(id).map(reg -> {
            reg.setStatus("PROCESSED");
            return registrationRepository.save(reg);
        }).orElseThrow(() -> new RuntimeException("Registration not found"));
    }
}
