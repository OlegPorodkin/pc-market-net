package ru.porodkin.pcmarketnet.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.porodkin.pcmarketnet.entity.Subcategory;
import ru.porodkin.pcmarketnet.repository.SubcategoryRepo;

import java.util.List;

@RestController
@RequestMapping("/subcategories")
public class SubcategoryController {
    private final SubcategoryRepo repository;

    public SubcategoryController(SubcategoryRepo repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Subcategory> getAll() {
        return repository.findAll();
    }
}
