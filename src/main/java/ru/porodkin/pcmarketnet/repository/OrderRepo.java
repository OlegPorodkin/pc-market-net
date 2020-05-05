package ru.porodkin.pcmarketnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.porodkin.pcmarketnet.entity.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {
}
