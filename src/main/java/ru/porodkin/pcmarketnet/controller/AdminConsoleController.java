package ru.porodkin.pcmarketnet.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.porodkin.pcmarketnet.entity.Role;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.repository.ProductRepo;

import javax.annotation.security.RolesAllowed;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminConsoleController {

    private final ProductRepo productRepo;

    public AdminConsoleController(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    @GetMapping
    public String helloAdmin(@AuthenticationPrincipal User user, Model model){
        Map<String, Object> data = new HashMap<>();

        data.put("profile", user);
        data.put("products", productRepo.findAll());

        model.addAttribute("adminInfo", data);
        return "admin_console";
    }
}
