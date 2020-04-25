package ru.porodkin.pcmarketnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.porodkin.pcmarketnet.entity.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {
}
