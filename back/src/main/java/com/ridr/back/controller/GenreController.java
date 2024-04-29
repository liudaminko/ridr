package com.ridr.back.controller;

import com.ridr.back.model.EditGenreDto;
import com.ridr.back.model.Genre;
import com.ridr.back.model.Publisher;
import com.ridr.back.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class GenreController {
    private final GenreRepository repository;

    @GetMapping
    public List<Genre> getPublishers() {
        return repository.getAll();
    }
    @GetMapping("/popular")
    public List<Genre> getPopularGenres() {
        return repository.getTop10GenresInLastMonth();
    }
    @GetMapping(params = "name")
    public List<Genre> getGenresByName(@RequestParam String name) {
        return repository.getGenreByName(name);
    }
    @GetMapping(params = "limit")
    public List<Genre> getGenresLimited(@RequestParam int limit) {
        return repository.getAllWithLimit(limit);
    }
    @PostMapping
    public int createGenre(@RequestBody Genre request) {
        return repository.create(request);
    }
    @PutMapping
    public int editGenre(@RequestBody EditGenreDto request) {
        return repository.edit(request);
    }
    @DeleteMapping
    public int deleteGenre(@RequestParam String name) {
        return repository.delete(name);
    }

}
