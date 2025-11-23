package com.flogin.service;

import com.flogin.dto.category.CategoryRequestDTO;
import com.flogin.entity.Category;
import com.flogin.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.List;


@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CategoryService {
    CategoryRepository categoryRepository;

    public Category createCategory(CategoryRequestDTO categoryRequestDTO) {
        return categoryRepository.save(new Category(categoryRequestDTO.getName()));
    }

    public Category getCategory(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new BadCredentialsException("Category không tồn tại"));
    }
    public List<Category> getAllCategory(){
        return categoryRepository.findAll();
    }
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public boolean existsById(Long id) { return categoryRepository.existsById(id); }
}
