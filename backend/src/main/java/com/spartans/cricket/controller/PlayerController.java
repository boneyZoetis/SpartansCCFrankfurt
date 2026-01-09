package com.spartans.cricket.controller;

import com.spartans.cricket.model.Player;
import com.spartans.cricket.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = { "http://localhost:5173", "file://", "null" })
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
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
        String imageUrl = "";
        if (image != null && !image.isEmpty()) {
            imageUrl = saveImage(image);
        }

        Player player = new Player();
        player.setName(name);
        player.setRole(role);
        player.setBattingStyle(battingStyle);
        player.setBowlingStyle(bowlingStyle);
        player.setMatches(matches);
        player.setRuns(runs);
        player.setWickets(wickets);
        player.setImageUrl(imageUrl);

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
            String imageUrl = saveImage(image);
            player.setImageUrl(imageUrl);
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

    private String saveImage(MultipartFile image) throws java.io.IOException {
        // Create uploads directory if not exists
        String uploadDir = "./uploads/";
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
        if (!java.nio.file.Files.exists(uploadPath)) {
            java.nio.file.Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String filename = java.util.UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        java.nio.file.Path filePath = uploadPath.resolve(filename);

        // Save file
        java.nio.file.Files.copy(image.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        return "http://localhost:8080/uploads/" + filename;
    }

    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable Long id) {
        playerRepository.deleteById(id);
    }
}
