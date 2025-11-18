package com.flogin.dto.product;

import com.flogin.dto.category.CategoryResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String productName;
    private BigDecimal price;
    private int quantity;
    private String description;
    private CategoryResponseDTO category;
}
