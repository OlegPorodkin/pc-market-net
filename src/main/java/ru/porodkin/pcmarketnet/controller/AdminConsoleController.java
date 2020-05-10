package ru.porodkin.pcmarketnet.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.porodkin.pcmarketnet.entity.Role;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.repository.ProductRepo;
import ru.porodkin.pcmarketnet.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminConsoleController {

    private final ProductRepo productRepo;
    private final UserService userService;

    public AdminConsoleController(ProductRepo productRepo, UserService userService) {
        this.productRepo = productRepo;
        this.userService = userService;
    }

    @GetMapping
    public String helloAdmin(@AuthenticationPrincipal User user, Model model) {
        Map<String, Object> data = new HashMap<>();

        data.put("profile", user);
        data.put("products", productRepo.findAll());

        model.addAttribute("adminInfo", data);
        return "admin_console";
    }

    @GetMapping("/users")
    public String viewAllUser(Model model) {
        Map<String, Object> data = new HashMap<>();
        List<User> all = userService.findAll();

        data.put("users", all);
        data.put("roles", Role.values());

        model.addAttribute("allUsers", data);
        return "user_admin";
    }
}
