package com.ridr.back.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminRepository {
    private final JdbcTemplate jdbcTemplate2;

    public int logInAdmin(String email, String password) {
        String query = "SELECT id FROM Admin WHERE email = ? AND password = ?";
        try {
            return jdbcTemplate2.queryForObject(query, Integer.class, email, password);
        } catch (Exception e) {
            return -1;
        }
    }
}
