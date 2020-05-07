package ru.porodkin.pcmarketnet.controller;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.porodkin.pcmarketnet.entity.Order;
import ru.porodkin.pcmarketnet.repository.OrderRepo;
import ru.porodkin.pcmarketnet.specification.OrderSpecification;

import java.util.List;

@Controller
@RequestMapping("/report")
public class ReportController {

    private final OrderRepo repository;
    private final OrderSpecification specification;

    public ReportController(OrderRepo repository, OrderSpecification specification) {
        this.repository = repository;
        this.specification = specification;
    }

    @GetMapping
    public String helloPage(){
        return "report";
    }

    @GetMapping("/get")
    public String getData(@RequestParam(value = "email") String email,
                          @RequestParam(value = "address") String address,
                          @RequestParam(value = "timeBefore") String before,
                          @RequestParam(value = "timeAfter") String after,
                          @RequestParam(value = "user") String user,
                          Model model){
        Specification<Order> orderSpec = Specification.where(specification.findAll());
        if (!email.equals("")){
            orderSpec = Specification.where(orderSpec).and(specification.byEmail(email));
        }
        if (!address.equals("")){
            orderSpec = Specification.where(orderSpec).and(specification.byAddress(address));
        }
        if (!before.equals("")){
            orderSpec = Specification.where(orderSpec).and(specification.byTimeBefore(before));
        }
        if (!after.equals("")){
            orderSpec = Specification.where(orderSpec).and(specification.byTimeAfter(after));
        }
        if (!user.equals("")){
            orderSpec = Specification.where(orderSpec).and(specification.byUserName(user));
        }


        List<Order> allOrders = repository.findAll(orderSpec);

        model.addAttribute("orders", allOrders);

        return "report";
    }
}
