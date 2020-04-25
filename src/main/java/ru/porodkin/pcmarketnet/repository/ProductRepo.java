package ru.porodkin.pcmarketnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.porodkin.pcmarketnet.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Long> {
}
