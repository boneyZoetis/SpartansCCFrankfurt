package com.spartans.cricket.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String preferredRole;
    private String experienceLevel;

    private String status = "NEW"; // NEW, PROCESSED
    private Boolean legalConsent;
    private java.time.LocalDateTime createdAt;

    @jakarta.persistence.PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = java.time.LocalDateTime.now();
        }
        if (status == null) {
            status = "NEW";
        }
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getLegalConsent() {
        return legalConsent;
    }

    public void setLegalConsent(Boolean legalConsent) {
        this.legalConsent = legalConsent;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPreferredRole() {
        return preferredRole;
    }

    public void setPreferredRole(String preferredRole) {
        this.preferredRole = preferredRole;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
}
