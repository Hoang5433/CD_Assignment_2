package com.flogin.mapper;

import com.flogin.dto.category.CategoryResponseDTO;
import com.flogin.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(source = "name", target = "name")
    CategoryResponseDTO toCategoryDTO(Category category);
}
