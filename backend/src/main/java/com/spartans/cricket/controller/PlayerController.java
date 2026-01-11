package com.spartans.cricket.controller;

import com.spartans.cricket.model.Player;
import com.spartans.cricket.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @GetMapping("/{id}/image")
    public org.springframework.http.ResponseEntity<byte[]> getPlayerImage(@PathVariable Long id) {
        Player player = playerRepository.findById(id).orElse(null);
        if (player != null && player.getImageData() != null) {
            return org.springframework.http.ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(
                            player.getImageContentType() != null ? player.getImageContentType() : "image/jpeg"))
                    .body(player.getImageData());
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }

    @PostMapping
    public Player addPlayer(
            @RequestParam("name") String name,
            @RequestParam("role") String role,
            @RequestParam("battingStyle") String battingStyle,
            @RequestParam("bowlingStyle") String bowlingStyle,
            @RequestParam("matches") int matches,
            @RequestParam("runs") int runs,
            @RequestParam("wickets") int wickets,
            @RequestParam(value = "image", required = false) MultipartFile image) throws java.io.IOException {

        Player player = new Player();
        player.setName(name);
        player.setRole(role);
        player.setBattingStyle(battingStyle);
        player.setBowlingStyle(bowlingStyle);
        player.setMatches(matches);
        player.setRuns(runs);
        player.setWickets(wickets);

        if (image != null && !image.isEmpty()) {
            player.setImageData(image.getBytes());
            player.setImageContentType(image.getContentType());
        }

        // Default approved to false for new registrations
        player.setApproved(false);

        Player savedPlayer = playerRepository.save(player);
        if (savedPlayer.getImageData() != null) {
            savedPlayer.setImageUrl("/api/players/" + savedPlayer.getId() + "/image");
            return playerRepository.save(savedPlayer);
        }

        return savedPlayer;
    }

    @PutMapping("/{id}/approve")
    public Player approvePlayer(@PathVariable Long id) {
        Player player = playerRepository.findById(id).orElseThrow();
        player.setApproved(true);
        return playerRepository.save(player);
    }

    @PutMapping("/{id}")
    public Player updatePlayer(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("role") String role,
            @RequestParam("battingStyle") String battingStyle,
            @RequestParam("bowlingStyle") String bowlingStyle,
            @RequestParam("matches") int matches,
            @RequestParam("runs") int runs,
            @RequestParam("wickets") int wickets,
            @RequestParam(value = "image", required = false) MultipartFile image) throws java.io.IOException {
        Player player = playerRepository.findById(id).orElseThrow();

        if (image != null && !image.isEmpty()) {
            player.setImageData(image.getBytes());
            player.setImageContentType(image.getContentType());
            player.setImageUrl("/api/players/" + id + "/image");
        }

        player.setName(name);
        player.setRole(role);
        player.setBattingStyle(battingStyle);
        player.setBowlingStyle(bowlingStyle);
        player.setMatches(matches);
        player.setRuns(runs);
        player.setWickets(wickets);

        return playerRepository.save(player);
    }

    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable Long id) {
        playerRepository.deleteById(id);
    }
}
