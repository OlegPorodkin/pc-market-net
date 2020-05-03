package ru.porodkin.pcmarketnet.controller;

import org.springframework.beans.BeanUtils;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.porodkin.pcmarketnet.entity.Product;
import ru.porodkin.pcmarketnet.entity.User;
import ru.porodkin.pcmarketnet.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAllProduct(){
        List<Product> products = service.findAll();

        return products;
    }

    @PostMapping
    public Product saveProduct(@RequestBody Product product){
        System.out.println(product);
        return service.save(product);
    }

    @PutMapping("{id}")
    public Product updateProduct(@PathVariable("id") Product productFromDb, @RequestBody Product product){
        System.out.println(product);
        BeanUtils.copyProperties(product, productFromDb, "id");
        return service.save(productFromDb);
    }

    @DeleteMapping("{id}")
    public void deleteProduct(@PathVariable("id") Product product){
        service.delete(product);
    }
}
