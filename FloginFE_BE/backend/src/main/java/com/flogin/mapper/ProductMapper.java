package com.flogin.mapper;

import com.flogin.dto.product.ProductResponseDTO;
import com.flogin.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = CategoryMapper.class)
public interface ProductMapper {
    @Mapping(source = "name", target = "productName")
    ProductResponseDTO toProductResponseDTO(Product product);
}
