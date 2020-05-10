package ru.porodkin.pcmarketnet.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.porodkin.pcmarketnet.entity.Order;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.service.OrderService;

@Controller
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public String getOrder(@RequestBody Order order, @AuthenticationPrincipal User user) {

        orderService.save(order, user);

        return "redirect:/";
    }

    @GetMapping
    public String viewOrder(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("profile", user);

        return "bucket";
    }
}
