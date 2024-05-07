package com.ridr.back.controller;

import com.ridr.back.model.Author;
import com.ridr.back.model.BookAuthors;
import com.ridr.back.model.BookAuthorsDTO;
import com.ridr.back.repository.BookAuthorsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookAuthors")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class BookAuthorsController {
    private final BookAuthorsRepository repository;
    @GetMapping
    public List<BookAuthorsDTO> getAuthors(@RequestParam int limit) {
        return repository.getAll(limit);
    }
    @PostMapping
    public int createBookAuthor(@RequestBody BookAuthors request) {
        int author = repository.create(request.getAuthorId(), request.getBookId());
        return author;
    }
    @DeleteMapping
    public int deleteBookAuthor(@RequestParam BookAuthors request) {
        int author = repository.delete(request.getAuthorId(), request.getBookId());
        return author;
    }
}
