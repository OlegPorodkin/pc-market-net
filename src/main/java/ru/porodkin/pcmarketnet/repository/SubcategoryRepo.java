package ru.porodkin.pcmarketnet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.porodkin.pcmarketnet.entity.Subcategory;

public interface SubcategoryRepo extends JpaRepository<Subcategory, Long> {
}
