package ru.porodkin.pcmarketnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ru.porodkin.pcmarketnet.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
}
