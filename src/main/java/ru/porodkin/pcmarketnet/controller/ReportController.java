package ru.porodkin.pcmarketnet.controller;

import org.springframework.core.io.Resource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.porodkin.pcmarketnet.entity.Order;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.repository.OrderRepo;
import ru.porodkin.pcmarketnet.repository.ProductRepo;
import ru.porodkin.pcmarketnet.repository.UserRepo;
import ru.porodkin.pcmarketnet.service.StorageService;
import ru.porodkin.pcmarketnet.specification.OrderSpecification;
import ru.porodkin.pcmarketnet.specification.ProductSpecification;
import ru.porodkin.pcmarketnet.specification.UserSpecification;

import java.util.List;

@Controller
@RequestMapping("/report")
public class ReportController {

    private final OrderRepo repository;
    private final OrderSpecification specification;
    private final UserRepo userRepository;
    private final UserSpecification userSpecification;
    private final ProductRepo productRepository;
    private final ProductSpecification productSpecification;
    private final StorageService storageService;

    public ReportController(OrderRepo repository, OrderSpecification specification, UserRepo userRepository, UserSpecification userSpecification, ProductRepo productRepository, ProductSpecification productSpecification, StorageService storageService) {
        this.repository = repository;
        this.specification = specification;
        this.userRepository = userRepository;
        this.userSpecification = userSpecification;
        this.productRepository = productRepository;
        this.productSpecification = productSpecification;
        this.storageService = storageService;
    }

    @GetMapping
    public String helloPage(@AuthenticationPrincipal User user, Model model) {
        List<Order> orderList = repository.findAll();
        model.addAttribute("profile", user);
        model.addAttribute("orders", orderList);
        return "report";
    }

    @GetMapping("/filter")
    public String getData(@AuthenticationPrincipal User profile,
                          @RequestParam(value = "email") String email,
                          @RequestParam(value = "address") String address,
                          @RequestParam(value = "timeBefore") String before,
                          @RequestParam(value = "timeAfter") String after,
                          @RequestParam(value = "user") String user,
                          Model model) {
        model.addAttribute("profile", profile);

        Specification<Order> orderSpec = Specification.where(specification.findAll());
        if (!email.equals("")) {
            orderSpec = Specification.where(orderSpec).and(specification.byEmail(email));
        }
        if (!address.equals("")) {
            orderSpec = Specification.where(orderSpec).and(specification.byAddress(address));
        }
        if (!before.equals("")) {
            orderSpec = Specification.where(orderSpec).and(specification.byTimeBefore(before));
        }
        if (!after.equals("")) {
            orderSpec = Specification.where(orderSpec).and(specification.byTimeAfter(after));
        }
        if (!user.equals("")) {
            orderSpec = Specification.where(orderSpec).and(specification.byUserName(user));
        }

        List<Order> allOrders = repository.findAll(orderSpec);

        model.addAttribute("orders", allOrders);

        return "report";
    }

    @GetMapping("/download/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> downloadReport(@PathVariable String filename) {
        Resource file = storageService.loadAsResource(filename);

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
}
