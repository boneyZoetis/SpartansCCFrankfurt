package com.spartans.cricket.repository;

import com.spartans.cricket.model.MatchFixture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchFixtureRepository extends JpaRepository<MatchFixture, Long> {
}
