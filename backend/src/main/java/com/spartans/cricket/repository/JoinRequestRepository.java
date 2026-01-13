package com.spartans.cricket.repository;

import com.spartans.cricket.model.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findByStatusOrderByCreatedAtDesc(String status);

    List<JoinRequest> findAllByOrderByCreatedAtDesc();
}
