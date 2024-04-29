package com.ridr.back.controller;

import com.ridr.back.model.Admin;
import com.ridr.back.model.User;
import com.ridr.back.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://ridr.s3-website.eu-north-1.amazonaws.com/"})
public class AdminController {
    private final AdminRepository repository;

    @PostMapping("/login")
    public ResponseEntity<Integer> loginUserEmail(@RequestBody Admin request) {
        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || password == null) {
            return ResponseEntity.badRequest().build();
        }

        int adminId = repository.logInAdmin(email, password);
        if (adminId != -1) {
            return ResponseEntity.ok(adminId);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
