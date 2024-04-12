package com.ridr.back.controller;

import com.ridr.back.model.User;
import com.ridr.back.model.Wishlist;
import com.ridr.back.model.WishlistBooks;
import com.ridr.back.repository.BookRepository;
import com.ridr.back.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class WishlistController {
    private final WishlistRepository repository;

    @GetMapping("/all")
    public List<Wishlist> getUserWishlists(@RequestParam int userId) {
        return repository.getUserWishlists(userId);
    }
    @GetMapping("/recent")
    public Wishlist getLastModifiedUserWishlist(@RequestParam int userId) {
        return repository.getLastModifiedUserWishlist(userId);
    }
    @GetMapping
    public WishlistBooks getUserWishlistById(@RequestParam int userId, @RequestParam int wishlistId) {
        return repository.getUserWishlistById(userId, wishlistId);
    }
    @PostMapping
    public Wishlist createWishlist(@RequestParam("name") String name, @RequestParam("userId") int userId) {
        return repository.createWishlist(name, userId);
    }
}
