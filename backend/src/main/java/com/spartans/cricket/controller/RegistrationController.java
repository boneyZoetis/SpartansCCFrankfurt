package com.spartans.cricket.controller;

import com.spartans.cricket.model.Registration;
import com.spartans.cricket.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    @PostMapping
    public Registration register(@RequestBody Registration registration) {
        return registrationRepository.save(registration);
    }
}
