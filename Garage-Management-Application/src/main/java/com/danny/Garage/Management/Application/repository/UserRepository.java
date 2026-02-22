package com.danny.Garage.Management.Application.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.danny.Garage.Management.Application.entity.User;
import java.util.List;
import java.time.LocalDateTime;




@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    List<User> findByCreatedAtAfter(LocalDateTime createdAt);

}
