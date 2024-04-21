package com.ridr.back.controller;

import com.ridr.back.configuration.DBContextHolder;
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
        List<Author> authors = repository.getAll();
        return authors;
    }
    @GetMapping("/fullinfo")
    public Author getFullAuthorInfo(@RequestParam int authorId) {
        Author author = repository.getFullAuthorInfo(authorId);
        return author;
    }

    @PostMapping
    public int createAuthor(@RequestBody Author request) {
        int author = repository.create(request);
        return author;
    }
    @PutMapping
    public Author editAuthor(@RequestBody Author request) {
        Author author = repository.edit(request);
        return author;
    }
}
