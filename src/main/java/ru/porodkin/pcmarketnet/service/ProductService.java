package ru.porodkin.pcmarketnet.service;

import org.springframework.stereotype.Service;
import ru.porodkin.pcmarketnet.entity.Product;
import ru.porodkin.pcmarketnet.entity.Subcategory;
import ru.porodkin.pcmarketnet.repository.ProductRepo;
import ru.porodkin.pcmarketnet.repository.SubcategoryRepo;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepo repository;
    private final SubcategoryRepo subcategoryRepo;

    public ProductService(ProductRepo repository, SubcategoryRepo subcategoryRepo) {
        this.repository = repository;
        this.subcategoryRepo = subcategoryRepo;
    }


    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product save(Product product) {
        Optional<Subcategory> subcategory = subcategoryRepo.findById(product.getSubcategory().getId());
        product.setSubcategory(subcategory.get());
        return repository.save(product);
    }

    public void delete(Product product) {
        repository.delete(product);
    }

    public Product findById(Long l) {
        return repository.findById(l).get();
    }
}
