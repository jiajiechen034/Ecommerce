package com.chen.e_commerce_backend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
        extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);
}