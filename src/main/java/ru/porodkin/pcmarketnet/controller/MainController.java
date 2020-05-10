package ru.porodkin.pcmarketnet.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.repository.CategoryRepo;
import ru.porodkin.pcmarketnet.repository.ProductRepo;
import ru.porodkin.pcmarketnet.repository.SubcategoryRepo;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/")
public class MainController {
    private final ProductRepo productRepo;
    private final SubcategoryRepo subcategoryRepo;
    private final CategoryRepo categoryRepo;

    public MainController(ProductRepo productRepo, SubcategoryRepo subcategoryRepo, CategoryRepo categoryRepo) {
        this.productRepo = productRepo;
        this.subcategoryRepo = subcategoryRepo;
        this.categoryRepo = categoryRepo;
    }

    @GetMapping
    public String index(Model model, @AuthenticationPrincipal User user) {
        Map<String, Object> data = new HashMap<>();

        data.put("profile", user);
        data.put("products", productRepo.findAll());
        data.put("subcat", subcategoryRepo.findAll());
        data.put("cat", categoryRepo.findAll());

        model.addAttribute("productData", data);
        return "index";
    }
}
