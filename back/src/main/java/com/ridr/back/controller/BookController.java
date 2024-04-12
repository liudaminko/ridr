package com.ridr.back.controller;

import com.ridr.back.model.FullInfoBook;
import com.ridr.back.model.ShortInfoBook;
import com.ridr.back.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class BookController {
    private final BookRepository repository;

    @GetMapping
    public List<ShortInfoBook> getBooks(@RequestParam(defaultValue = "20") int limit, @RequestParam(defaultValue = "0") int offset) {
        return repository.getBooks(limit, offset);
    }
    @GetMapping("/authorized")
    public List<ShortInfoBook> getBooksAuthorized(@RequestParam(defaultValue = "20") int limit, @RequestParam(defaultValue = "0") int offset, int userId) {
        return repository.getBooksAuthorized(limit, offset, userId);
    }

    @GetMapping("/fullinfo")
    public FullInfoBook getFullInfoBook(@RequestParam int bookId) {
        return repository.getFullInfoBook(bookId);
    }
}
