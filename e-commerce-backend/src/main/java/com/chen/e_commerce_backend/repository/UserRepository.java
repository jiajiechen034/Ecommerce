package com.chen.e_commerce_backend.repository;

import com.chen.e_commerce_backend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
        extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);
}