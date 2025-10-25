package com.flogin.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @GetMapping
    public String getAllProducts() {
        // TODO: Implement get all products
        return "Products list";
    }

    @PostMapping
    public String createProduct(@RequestBody String product) {
        // TODO: Implement create product
        return "Product created";
    }
}
