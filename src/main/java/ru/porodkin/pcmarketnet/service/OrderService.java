package ru.porodkin.pcmarketnet.service;

import org.springframework.stereotype.Service;
import ru.porodkin.pcmarketnet.entity.Order;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.repository.OrderRepo;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepo orderRepo;

    public OrderService(OrderRepo orderRepo) {
        this.orderRepo = orderRepo;
    }


    public Order save(Order order, User user) {
        order.setOrderDate(ZonedDateTime.now());

        if (user != null) {
            order.setUser(user);
        }

        return orderRepo.saveAndFlush(order);
    }

    public List<Order> findAll() {
        List<Order> all = orderRepo.findAll();
        orderRepo.flush();
        return all;
    }
}
