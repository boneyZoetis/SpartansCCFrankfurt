package com.spartans.cricket.controller;

import com.spartans.cricket.model.Achievement;
import com.spartans.cricket.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = { "http://localhost:5173", "file://", "null" })
public class AchievementController {

    @Autowired
    private AchievementRepository achievementRepository;

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    @PostMapping
    public Achievement addAchievement(@RequestBody Achievement achievement) {
        return achievementRepository.save(achievement);
    }

    @PutMapping("/{id}")
    public Achievement updateAchievement(@PathVariable Long id, @RequestBody Achievement achievementDetails) {
        Achievement achievement = achievementRepository.findById(id).orElseThrow();
        achievement.setTitle(achievementDetails.getTitle());
        achievement.setAchievementYear(achievementDetails.getAchievementYear());
        achievement.setType(achievementDetails.getType());
        return achievementRepository.save(achievement);
    }

    @DeleteMapping("/{id}")
    public void deleteAchievement(@PathVariable Long id) {
        achievementRepository.deleteById(id);
    }
}
