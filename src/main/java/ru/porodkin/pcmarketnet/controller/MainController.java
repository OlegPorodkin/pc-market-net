package ru.porodkin.pcmarketnet.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.repository.ProductRepo;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/")
public class MainController {
    private final ProductRepo productRepo;

    public MainController(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    @GetMapping
    public String index(Model model, @AuthenticationPrincipal User user) {
        Map<String, Object> data = new HashMap<>();

        data.put("profile", user);
        data.put("products", productRepo.findAll());

        model.addAttribute("productData", data);
        return "index";
    }
}
