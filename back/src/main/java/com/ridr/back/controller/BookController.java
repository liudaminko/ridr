package com.ridr.back.controller;

import com.ridr.back.model.FullInfoBook;
import com.ridr.back.model.Publisher;
import com.ridr.back.model.ShortInfoBook;
import com.ridr.back.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/book")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://ridr.s3-website.eu-north-1.amazonaws.com/"})
public class BookController {
    private final BookRepository repository;

    @GetMapping
    public List<ShortInfoBook> getBooks(@RequestParam(defaultValue = "20") int limit, @RequestParam(defaultValue = "0") int offset) {
        return repository.getBooks(limit, offset);
    }
    @GetMapping("/authorized")
    public List<ShortInfoBook> getBooksAuthorized(@RequestParam(defaultValue = "20") int limit, @RequestParam(defaultValue = "0") int offset, int userId, @RequestParam(defaultValue = "-1") int genre,  @RequestParam(defaultValue = "-1") int publisher,  @RequestParam(defaultValue = "-1") int author,  @RequestParam(defaultValue = "-1") String language) {
        return repository.getBooksAuthorized(limit, offset, userId, genre, publisher, author, language);
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
    @GetMapping("/new")
    public List<ShortInfoBook> getNewBooksAuthorized(@RequestParam int userId) {
        return repository.getNewBooksLastMonthAuthorized(userId);
    }
    @GetMapping("/new/nonauthorized")
    public List<ShortInfoBook> getNewBooksNonAuthorized() {
        return repository.getNewBooksLastMonthNotAuthorized();
    }
    @GetMapping("/popularmonth")
    public List<ShortInfoBook> getPopularBooksDuringLastMonth(@RequestParam Integer userId) {
        return repository.getMostPopularBooksInLastMonthAuthorized(userId);
    }
    @GetMapping("/popularmonth/nonauthorized")
    public List<ShortInfoBook> getPopularBooksDuringLastMonth() {
        return repository.getMostPopularBooksInLastMonthNotAuthorized();
    }
    @GetMapping(params = "limit")
    public List<FullInfoBook> getBooksLimited(@RequestParam int limit) {
        return repository.getAllWithLimit(limit);
    }
    @GetMapping("/kids")
    public List<ShortInfoBook> getKidsBooks() {
        return repository.getBooksForKids();
    }

    @PostMapping
    public FullInfoBook createBook(@RequestBody FullInfoBook request) {
        return repository.create(request);
    }

    @DeleteMapping
    public int deleteBook(@RequestParam String isbn) {
        return repository.delete(isbn);
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
