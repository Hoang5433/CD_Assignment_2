//package com.flogin.services;
//
//import com.flogin.dto.category.CategoryResponseDTO;
//import com.flogin.dto.product.ProductRequestDTO;
//import com.flogin.dto.product.ProductResponseDTO;
//import com.flogin.entity.Category;
//import com.flogin.entity.Product;
//import com.flogin.mapper.CategoryMapper;
//import com.flogin.mapper.ProductMapper;
//import com.flogin.repository.CategoryRepository;
//import com.flogin.repository.ProductRepository;
//import com.flogin.service.ProductService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.math.BigDecimal;
//import java.util.List;
//import java.util.Optional;
//
//import static org.mockito.Mockito.when;
//
//class ProductServiceTest {
//
//    @InjectMocks
//    private ProductService productService;
//    @Mock
//    private ProductRepository productRepository;
//    @Mock
//    private CategoryRepository categoryRepository;
//    @Mock
//    private CategoryMapper categoryMapper;
//    @Mock
//    private ProductMapper productMapper;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//
//        // Tạo mảng category giả lập
//        List<Category> categories = List.of(
//                new Category("Laptop"),
//                new Category("Phone")
//        );
//
//        // Mock repository trả về category dựa trên id
//        when(categoryRepository.findById(1L)).thenReturn(Optional.of(categories.get(0)));
//        when(categoryRepository.findById(2L)).thenReturn(Optional.of(categories.get(1)));
//
//        // Mock mapper chuyển đổi
//        when(categoryMapper.toCategoryDTO(categoryRepository.findById(1L).get()))
//                .thenReturn(new CategoryResponseDTO( "Laptop"));
//        when(categoryMapper.toCategoryDTO(categories.get(1))).thenReturn(new CategoryResponseDTO( "Phone"));
//    }
//
//    @Test
//    @DisplayName("TC1: Tao san pham moi thanh cong")
//    void testCreateProduct() {
//        ProductRequestDTO productRequestDTO = new ProductRequestDTO(
//                "Laptop",
//                BigDecimal.valueOf(15000000),
//                10,
//                "Dell la Laptop",
//                1L
//        );
//        ProductResponseDTO product = new ProductResponseDTO(
//                1L,
//                "Laptop",
//                BigDecimal.valueOf(15000000),
//                10,
//                "Dell la Laptop",
//                categoryMapper.toCategoryDTO(categoryRepository.findById(1L))
//        );
//    }
//
//    @Test
//    void updateProduct() {
//    }
//
//    @Test
//    void deleteProduct() {
//    }
//
//    @Test
//    void getProduct() {
//    }
//
//    @Test
//    void getAllProduct() {
//    }
//}