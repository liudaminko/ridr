package com.ridr.back.controller;


import com.ridr.back.model.Wishlist;
import com.ridr.back.model.WishlistBooks;
import com.ridr.back.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://ridr.s3-website.eu-north-1.amazonaws.com/"})
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
    public Wishlist createWishlist(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        Integer userIdObj = (Integer) payload.get("userId");
        if (name == null || userIdObj == null) {
            throw new IllegalArgumentException("Name and userId are required.");
        }

        int userId = userIdObj.intValue();

        return repository.createWishlist(name, userId);
    }

    @PostMapping("/like")
    public int AddToWishlist(@RequestBody Map<String, Object> payload) {
        Integer wishlistId = (Integer) payload.get("wishlistId");
        Integer userId = (Integer) payload.get("userId");
        Integer bookId = (Integer) payload.get("bookId");
        return repository.addBookToWishlist(wishlistId, userId, bookId);

    }

}
