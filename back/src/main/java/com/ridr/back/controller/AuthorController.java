package com.ridr.back.controller;

import com.ridr.back.model.Author;
import com.ridr.back.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/author")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class AuthorController {
    private final AuthorRepository repository;

    @GetMapping
    public List<Author> getAuthors() {
        return repository.getAll();
    }
    @GetMapping("/fullinfo")
    public Author getFullAuthorInfo(@RequestParam int authorId) {
        return repository.getFullAuthorInfo(authorId);
    }
}
