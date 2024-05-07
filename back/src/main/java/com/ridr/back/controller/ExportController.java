package com.ridr.back.controller;

import com.ridr.back.model.ShortInfoBook;
import com.ridr.back.repository.ExportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/export")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://ridr.s3-website.eu-north-1.amazonaws.com/"})
public class ExportController {
    private final ExportRepository repository;

    @GetMapping("/book/csv")
    public String getBookFactCSV(
            @RequestParam(required = true, name = "selectedColumns") List<String> selectedColumns,
            @RequestParam(required = true, name = "limit") int limit

    ) {

        return repository.getBookSaleFactCSV(selectedColumns, limit);
    }

    @GetMapping("/delivery/csv")
    public String getDeliveryFactCSV(
            @RequestParam(required = true, name = "selectedColumns") List<String> selectedColumns,
            @RequestParam(required = true, name = "limit") int limit
    ) {
        return repository.getDeliveryFactCSV(selectedColumns, limit);
    }

    @GetMapping("/order/csv")
    public String getOrderFactCSV(
            @RequestParam(required = true, name = "selectedColumns") List<String> selectedColumns,
            @RequestParam(required = true, name = "limit") int limit
    ) {
        return repository.getOrderFactCSV(selectedColumns, limit);
    }

    @GetMapping("/book/json")
    public String getBookFactJSON(
            @RequestParam(required = true, name = "selectedColumns") List<String> selectedColumns,
            @RequestParam(required = true, name = "limit") int limit

    ) {

        return repository.getBookSaleFactJSON(selectedColumns, limit);
    }

    @GetMapping("/delivery/json")
    public String getDeliveryFactJSON(
            @RequestParam(required = true, name = "selectedColumns") List<String> selectedColumns,
            @RequestParam(required = true, name = "limit") int limit
    ) {
        return repository.getDeliveryFactJSON(selectedColumns, limit);
    }

    @GetMapping("/order/json")
    public String getOrderFactJSON(
            @RequestParam(required = true, name = "selectedColumns") List<String> selectedColumns,
            @RequestParam(required = true, name = "limit") int limit
    ) {
        return repository.getOrderFactJSON(selectedColumns, limit);
    }
}
