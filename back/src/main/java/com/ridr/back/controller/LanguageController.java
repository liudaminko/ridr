package com.ridr.back.controller;

import com.ridr.back.model.Language;
import com.ridr.back.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/language")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")
public class LanguageController {
    private final LanguageRepository repository;

    @GetMapping
    public List<Language> getLanguages() {
        return repository.getAll();
    }
}
