package com.flogin.service;

import com.flogin.dto.product.ProductRequestDTO;
import com.flogin.dto.product.ProductResponseDTO;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;
import com.flogin.mapper.CategoryMapper;
import com.flogin.mapper.ProductMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class ProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;

    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        Category category = categoryRepository.findById(productRequestDTO.getCategory_id())
                .orElseThrow(() -> new RuntimeException("Category không tồn tại"));
        Product product = new Product(productRequestDTO.getProductName(),
                productRequestDTO.getPrice(),
                productRequestDTO.getQuantity(),
                productRequestDTO.getDescription(),
                category);
        productRepository.save(product);
        return new ProductResponseDTO(
                product.getId(),
                productRequestDTO.getProductName(),
                productRequestDTO.getPrice(),
                productRequestDTO.getQuantity(),
                productRequestDTO.getDescription(),
                category
        );
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO productRequestDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
        Category category = categoryRepository.findById(productRequestDTO.getCategory_id())
                .orElseThrow(() -> new BadCredentialsException("Category không tồn tại"));
        product.setName(productRequestDTO.getProductName());
        product.setPrice(productRequestDTO.getPrice());
        product.setQuantity(productRequestDTO.getQuantity());
        product.setDescription(productRequestDTO.getDescription());
        product.setCategory(category);
        productRepository.save(product);
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getQuantity(),
                product.getDescription(),
                category
        );
    }
    public ProductResponseDTO deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
        productRepository.delete(product);
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getQuantity(),
                product.getDescription(),
                product.getCategory()
        );
    }
    public ProductResponseDTO getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product không tồn tại"));
        return productMapper.toProductResponseDTO(product);
    }
    public List<ProductResponseDTO> getAllProduct(){
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) return null;
        List<ProductResponseDTO> responseDTOList = new ArrayList<>();
        for (Product product : products){
            responseDTOList.add(productMapper.toProductResponseDTO(product));
        }
        return responseDTOList;
    }
    public Page<ProductResponseDTO> getAllProduct(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(product -> productMapper.toProductResponseDTO(product));
    }
}