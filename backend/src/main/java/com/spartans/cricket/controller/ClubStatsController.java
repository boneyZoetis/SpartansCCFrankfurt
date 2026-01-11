package com.spartans.cricket.controller;

import com.spartans.cricket.model.ClubStats;
import com.spartans.cricket.repository.ClubStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class ClubStatsController {

    @Autowired
    private ClubStatsRepository clubStatsRepository;

    @GetMapping
    public ClubStats getStats() {
        return clubStatsRepository.findAll().stream().findFirst().orElse(null);
    }

    @PostMapping
    public ClubStats updateStats(@RequestBody ClubStats stats) {
        // Ensure we only have one record
        ClubStats existing = clubStatsRepository.findAll().stream().findFirst().orElse(null);
        if (existing != null) {
            existing.setMatchesWon(stats.getMatchesWon());
            existing.setActivePlayers(stats.getActivePlayers());
            existing.setChampionships(stats.getChampionships());
            return clubStatsRepository.save(existing);
        } else {
            return clubStatsRepository.save(stats);
        }
    }
}
