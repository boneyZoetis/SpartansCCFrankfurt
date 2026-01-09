package com.spartans.cricket.repository;

import com.spartans.cricket.model.ClubStats;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubStatsRepository extends JpaRepository<ClubStats, Long> {
}
