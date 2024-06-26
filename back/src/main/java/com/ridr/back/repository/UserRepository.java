package com.ridr.back.repository;

import com.ridr.back.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserRepository {
    private final JdbcTemplate jdbcTemplate1;

    public User createUser(User user) {
        String maxIdQuery = "SELECT MAX(id) FROM Customer";
        Integer maxId = jdbcTemplate1.queryForObject(maxIdQuery, Integer.class);
        int newId = (maxId != null) ? maxId + 1 : 1;

        String uniqueCheckQuery = "SELECT COUNT(*) FROM Customer WHERE email = ? OR phone_number = ?";
        int count = jdbcTemplate1.queryForObject(uniqueCheckQuery, Integer.class, user.getEmail(), user.getPhoneNumber());
        if (count > 0) {
            return null;
        }

        String insertQuery = "INSERT INTO Customer (id, first_name, last_name, email, phone_number, password, birth_date, sex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate1.update(insertQuery, newId, user.getFirstName(), user.getLastName(), user.getEmail(), user.getPhoneNumber(), user.getPassword(), user.getBirthDate(), user.getGender());

        user.setId(newId);

        return user;
    }

    public int getUserIdByEmailAndPassword(String email, String password) {
        String query = "SELECT id FROM Customer WHERE email = ? AND password = ?";
        try {
            return jdbcTemplate1.queryForObject(query, Integer.class, email, password);
        } catch (Exception e) {
            return -1;
        }
    }

    public int getUserIdByPhoneAndPassword(String phone, String password) {
        String query = "SELECT id FROM Customer WHERE phone_number = ? AND password = ?";
        try {
            return jdbcTemplate1.queryForObject(query, Integer.class, phone, password);
        } catch (Exception e) {
            return -1;
        }
    }

    public User getUserById(int userId) {
        String query = "SELECT first_name, last_name, email, phone_number from Customer " +
                "WHERE id = ?";
        return jdbcTemplate1.queryForObject(query, new Object[]{userId}, new BeanPropertyRowMapper<>(User.class));
    }
}
