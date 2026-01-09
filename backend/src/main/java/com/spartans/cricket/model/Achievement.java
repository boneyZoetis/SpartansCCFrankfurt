package com.spartans.cricket.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String achievementYear;
    private String type; // TROPHY, MEDAL, STAR, AWARD

    public Achievement() {
    }

    public Achievement(Long id, String title, String achievementYear, String type) {
        this.id = id;
        this.title = title;
        this.achievementYear = achievementYear;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAchievementYear() {
        return achievementYear;
    }

    public void setAchievementYear(String achievementYear) {
        this.achievementYear = achievementYear;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
