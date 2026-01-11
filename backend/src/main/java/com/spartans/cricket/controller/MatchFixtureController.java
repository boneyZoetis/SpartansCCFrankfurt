package com.spartans.cricket.controller;

import com.spartans.cricket.model.MatchFixture;
import com.spartans.cricket.repository.MatchFixtureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchFixtureController {

    @Autowired
    private MatchFixtureRepository matchFixtureRepository;

    @GetMapping
    public List<MatchFixture> getAllMatches() {
        return matchFixtureRepository.findAll();
    }

    @PostMapping
    public MatchFixture addMatch(@RequestBody MatchFixture match) {
        return matchFixtureRepository.save(match);
    }

    @PutMapping("/{id}")
    public MatchFixture updateMatch(@PathVariable Long id, @RequestBody MatchFixture matchDetails) {
        MatchFixture match = matchFixtureRepository.findById(id).orElseThrow();
        match.setOpponent(matchDetails.getOpponent());
        match.setMatchDate(matchDetails.getMatchDate());
        match.setVenue(matchDetails.getVenue());
        match.setStatus(matchDetails.getStatus());
        match.setResult(matchDetails.getResult());
        return matchFixtureRepository.save(match);
    }

    @DeleteMapping("/{id}")
    public void deleteMatch(@PathVariable Long id) {
        matchFixtureRepository.deleteById(id);
    }
}
