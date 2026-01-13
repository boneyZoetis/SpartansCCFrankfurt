package com.spartans.cricket.repository;

import com.spartans.cricket.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    long countByEmailOrPhoneNumber(String email, String phoneNumber);
}
