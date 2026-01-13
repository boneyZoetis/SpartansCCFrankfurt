package com.spartans.cricket.config;

import com.spartans.cricket.model.ClubStats;
import com.spartans.cricket.model.MatchFixture;
import com.spartans.cricket.model.Player;
import com.spartans.cricket.repository.MatchFixtureRepository;
import com.spartans.cricket.repository.PlayerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

import com.spartans.cricket.model.Achievement;
import com.spartans.cricket.repository.AchievementRepository;

@Configuration
public class DataInitializer {

        @Bean
        CommandLineRunner initData(PlayerRepository playerRepository, MatchFixtureRepository matchRepository,
                        com.spartans.cricket.repository.ClubStatsRepository clubStatsRepository,
                        AchievementRepository achievementRepository,
                        org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
                return args -> {
                        // Fix Schema: Ensure approved column exists (Hibernate ddl-auto=update failed)
                        try {
                                jdbcTemplate.execute(
                                                "ALTER TABLE player ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE");
                                // Update existing players to be approved (migration)
                                jdbcTemplate.execute(
                                                "UPDATE player SET legal_consent = FALSE WHERE legal_consent IS NULL");

                                // Fix Schema: Registration
                                jdbcTemplate.execute(
                                                "ALTER TABLE registration ADD COLUMN IF NOT EXISTS status VARCHAR(255) DEFAULT 'NEW'");
                                jdbcTemplate.execute(
                                                "ALTER TABLE registration ADD COLUMN IF NOT EXISTS legal_consent BOOLEAN DEFAULT FALSE");
                                jdbcTemplate.execute(
                                                "ALTER TABLE registration ADD COLUMN IF NOT EXISTS created_at TIMESTAMP");
                        } catch (Exception e) {
                                System.out.println("Schema update warning (might already exist): " + e.getMessage());
                        }

                        // Init Players
                        if (playerRepository.count() == 0) {
                                List<Player> players = List.of(
                                                new Player(null, "Virat (King)", "Batsman", "Right-hand bat",
                                                                "Right-arm medium", 254, 12000, 4,
                                                                "https://images.unsplash.com/photo-1624526267942-ab4eff054842?w=500&auto=format&fit=crop&q=60",
                                                                true),
                                                new Player(null, "Boney Mathew", "Captain", "Right-hand bat",
                                                                "Right-arm spin", 85, 3500, 45,
                                                                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60",
                                                                true),
                                                new Player(null, "Rohit Hitman", "Batsman", "Right-hand bat",
                                                                "Right-arm offbreak", 230, 9500, 8,
                                                                "https://images.unsplash.com/photo-1593341646261-0b5c531d8e17?w=500&auto=format&fit=crop&q=60",
                                                                true),
                                                new Player(null, "Boom Boom Bumrah", "Bowler", "Right-hand bat",
                                                                "Right-arm fast", 120, 500, 250,
                                                                "https://images.unsplash.com/photo-1531415074984-05663041d832?w=500&auto=format&fit=crop&q=60",
                                                                true),
                                                new Player(null, "Sir Jadeja", "All-rounder", "Left-hand bat",
                                                                "Slow left-arm orthodox", 180, 4000, 300,
                                                                "https://images.unsplash.com/photo-1624194092288-66236b2f6723?w=500&auto=format&fit=crop&q=60",
                                                                true),
                                                new Player(null, "Glenn Maxwell", "All-rounder", "Right-hand bat",
                                                                "Right-arm spin", 150, 4500, 110,
                                                                "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500&auto=format&fit=crop&q=60",
                                                                true),
                                                new Player(null, "Mitchell Starc", "Bowler", "Left-hand bat",
                                                                "Left-arm fast", 100, 800, 190,
                                                                "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&auto=format&fit=crop&q=60",
                                                                true),
                                                new Player(null, "Steve Smith", "Batsman", "Right-hand bat", "Leg spin",
                                                                210, 8500, 15,
                                                                "https://images.unsplash.com/photo-1542300057-79b88235e121?w=500&auto=format&fit=crop&q=60",
                                                                true));
                                playerRepository.saveAll(players);
                        }

                        // Init Matches
                        if (matchRepository.count() == 0) {
                                List<MatchFixture> matches = List.of(
                                                new MatchFixture(null, "Super Kings", LocalDateTime.now(),
                                                                "Spartans Home Ground", "Live",
                                                                "Spartans batting at 140/2"),
                                                new MatchFixture(null, "Thunderbolts CC",
                                                                LocalDateTime.now().plusDays(2), "Spartans Home Ground",
                                                                "Upcoming", "VS"),
                                                new MatchFixture(null, "Warriors XI", LocalDateTime.now().plusDays(7),
                                                                "City Oval", "Upcoming", "VS"),
                                                new MatchFixture(null, "Titans", LocalDateTime.now().plusDays(10),
                                                                "Riverside Stadium", "Upcoming", "VS"),
                                                new MatchFixture(null, "Panthers", LocalDateTime.now().plusDays(15),
                                                                "Spartans Home Ground", "Upcoming", "VS"),
                                                new MatchFixture(null, "Royal Strikers",
                                                                LocalDateTime.now().minusDays(3),
                                                                "Spartans Home Ground", "Completed",
                                                                "Won by 4 wickets"),
                                                new MatchFixture(null, "Eagles", LocalDateTime.now().minusDays(10),
                                                                "Eagle Nest", "Completed", "Lost by 15 runs"),
                                                new MatchFixture(null, "Lions", LocalDateTime.now().minusDays(20),
                                                                "City Oval", "Completed", "Won by 8 wickets"),
                                                new MatchFixture(null, "Dragons", LocalDateTime.now().plusDays(20),
                                                                "Dragon's Den", "Upcoming", "VS"),
                                                new MatchFixture(null, "Vipers", LocalDateTime.now().plusDays(25),
                                                                "City Oval", "Upcoming", "VS"),
                                                new MatchFixture(null, "Tigers", LocalDateTime.now().minusDays(25),
                                                                "Jungle Oval", "Completed", "Won by 50 runs"),
                                                new MatchFixture(null, "Sharks", LocalDateTime.now().minusDays(30),
                                                                "Coastal Ground", "Completed", "Lost by 3 wickets"));
                                matchRepository.saveAll(matches);
                        }
                        // Init Club Stats
                        if (clubStatsRepository.count() == 0) {
                                clubStatsRepository.save(new ClubStats(null, 50, 120, 5));
                        }

                        // Init Achievements
                        try {
                                if (achievementRepository.count() == 0) {
                                        List<Achievement> achievements = List.of(
                                                        new Achievement(null, "Region League Champions", "2023, 2021",
                                                                        "TROPHY"),
                                                        new Achievement(null, "T20 Cup Finalists", "2022", "MEDAL"),
                                                        new Achievement(null, "Fair Play Award", "2022, 2020", "STAR"),
                                                        new Achievement(null, "Best Youth Academy", "2023", "AWARD"),
                                                        new Achievement(null, "Inter-City Cup Winners", "2019",
                                                                        "TROPHY"),
                                                        new Achievement(null, "Community Spirit Award", "2021",
                                                                        "AWARD"));
                                        achievementRepository.saveAll(achievements);
                                }
                        } catch (Exception e) {
                                System.err.println("Failed to initialize achievements: " + e.getMessage());
                        }
                };
        }
}
