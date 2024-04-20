package com.ridr.back.controller;

import com.ridr.back.model.ShoppingCart;
import com.ridr.back.repository.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class ShoppingCartController {
    private final ShoppingCartRepository repository;

    @GetMapping
    public List<ShoppingCart> getShoppingCart(@RequestParam int userId) {
        return repository.getCart(userId);
    }

    @PostMapping
    public ShoppingCart addBookToCart(@RequestBody Map<String, Object> requestBody) {
        int bookId = (int) requestBody.get("bookId");
        int userId = (int) requestBody.get("userId");
        return repository.addBookCart(bookId, userId);
    }
    @DeleteMapping
    public int deleteBookFromCart(@RequestParam int bookId, @RequestParam int userId) {
        return repository.removeBookFromCart(bookId, userId);
    }
    @DeleteMapping("/all")
    public int deleteCart(@RequestParam int userId) {
        return repository.removeCart(userId);
    }
    @PutMapping()
    public int changeBookQuantity(@RequestBody Map<String, Object> requestBody) {
        int bookId = (int) requestBody.get("bookId");
        int userId = (int) requestBody.get("userId");
        int quantity = (int) requestBody.get("quantity");
        return repository.changeQuantity(bookId, userId, quantity);
    }
}
