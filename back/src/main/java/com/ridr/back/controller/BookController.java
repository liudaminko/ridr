package com.ridr.back.controller;

import com.ridr.back.model.FullInfoBook;
import com.ridr.back.model.ShortInfoBook;
import com.ridr.back.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/catalog")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://ridr.s3-website.eu-north-1.amazonaws.com/"})
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

    @GetMapping("/search")
    public List<ShortInfoBook> findAnyBooks(@RequestParam String keywords) {
        return repository.findAnyBooksFilter(keywords);
    }

    @GetMapping("/short")
    public ShortInfoBook getShortInfoBookAuthorized(@RequestParam int userId, int bookId) {
        return repository.getShortInfoBookAuthorized(userId, bookId);
    }
    @GetMapping("/popularmonth")
    public List<ShortInfoBook> getPopularBooksDuringLastMonth(@RequestParam int userId) {
        return repository.getMostPopularBooksInLastMonth(userId);
    }


//    @PostMapping("/like")
//    public ShortInfoBook AddToWishlist(@RequestBody Map<String, Object> payload) {
//        Integer wishlistId = (Integer) payload.get("wishlistId");
//        Integer userId = (Integer) payload.get("userId");
//        Integer bookId = (Integer) payload.get("bookId");
//        return repository.addBookToWishlist(wishlistId, userId, bookId);
//
//    }
}
