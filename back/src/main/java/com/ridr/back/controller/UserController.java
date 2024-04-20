package com.ridr.back.controller;

import com.ridr.back.model.User;
import com.ridr.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class UserController {
    private final UserRepository repository;

    @PostMapping("/signup")
    public User createUser(@RequestBody User user) {
        return repository.createUser(user);
    }

    @PostMapping("/login/email")
    public ResponseEntity<Integer> loginUserEmail(@RequestBody User request) {
        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || password == null) {
            return ResponseEntity.badRequest().build();
        }

        int userId = repository.getUserIdByEmailAndPassword(email, password);
        if (userId != -1) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @PostMapping("/login/phone")
    public ResponseEntity<Integer> loginUserPhone(@RequestBody User request) {
        String phone = request.getPhoneNumber();
        String password = request.getPassword();

        if (phone == null || password == null) {
            return ResponseEntity.badRequest().build();
        }

        int userId = repository.getUserIdByPhoneAndPassword(phone, password);
        if (userId != -1) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @GetMapping("/info")
    public User getUserInfo(@RequestParam int userId) {
        return repository.getUserById(userId);
    }
}
