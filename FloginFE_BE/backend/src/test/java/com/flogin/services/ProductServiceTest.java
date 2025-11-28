package com.flogin.services;

import com.flogin.BaseFake.BaseFakeCategoryRepository;

import com.flogin.BaseFake.BaseFakeProductRepository;
import com.flogin.dto.product.ProductRequestDTO;
import com.flogin.dto.product.ProductResponseDTO;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.mapper.ProductMapper;
import com.flogin.repository.CategoryRepository;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Product Service Unit tests")
public class ProductServiceTest {
    private ProductService productService;

    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;
    private ProductMapper productMapper;
    private List<Product> dbProducts;
    private List<Category> dbCategories;


    @BeforeEach
    void setUp() {
        dbCategories = new ArrayList<>();
        dbCategories.add(Category.builder().id(1L).name("Laptop").build());
        dbCategories.add(Category.builder().id(2L).name("Smartphone").build());
        dbProducts = new ArrayList<>();
        dbProducts.add(Product.builder()
                .id(1L)
                .name("Dell Xenos 3000")
                .price(BigDecimal.valueOf(15000000))
                .quantity(10)
                .description("Dell la laptop")
                .category(dbCategories.get(0))
                .build()
        );

        dbProducts.add(Product.builder()
                .id(2L)
                .name("Iphone 15")
                .price(BigDecimal.valueOf(20000000))
                .quantity(5)
                .description("Iphone la mobile")
                .category(dbCategories.get(1))
                .build()
        );

        productRepository = new BaseFakeProductRepository() {
            @Override
            public <S extends Product> S save(S entity) {
                if (entity.getId() == null) {
                    entity.setId(dbProducts.size() + 1L);
                    dbProducts.add(entity);
                } else {
                    for (int i = 0; i < dbProducts.size(); i++) {
                        if (dbProducts.get(i).getId().equals(entity.getId())) {
                            dbProducts.set(i, entity);
                            break;
                        }
                    }
                }
                return entity;
            }

            @Override
            public Optional<Product> findById(Long id) {
                return dbProducts.stream().filter(p -> p.getId().equals(id)).findFirst();
            }

            @Override
            public Page<Product> findAll(Pageable pageable) {
                int start = pageable.getPageNumber() * pageable.getPageSize();
                List<Product> list;
                if (start >= dbProducts.size()) list = new ArrayList<>();
                else {
                    int end = Math.min(start + pageable.getPageSize(), dbProducts.size());
                    list = dbProducts.subList(start, end);
                }
                return new PageImpl<>(list, pageable, dbProducts.size());
            }
            @Override
            public List<Product> findAll() {
                return dbProducts;
            }

            @Override
            public void delete(Product entity) {
                dbProducts.removeIf(p -> p.getId().equals(entity.getId()));
            }
        };
        categoryRepository = new BaseFakeCategoryRepository() {
            @Override
            public Optional<Category> findById(Long id) {
                return dbCategories.stream().filter(c -> c.getId().equals(id)).findFirst();
            }
        };
        productMapper = new ProductMapper() {
            @Override
            public ProductResponseDTO toProductResponseDTO(Product product) {
                return new ProductResponseDTO(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getQuantity(),
                        product.getDescription(),
                        product.getCategory()
                );
            }
        };
        productService = new ProductService(productRepository, categoryRepository, productMapper);
    }

    @Test
    @DisplayName("TC1: Tao san pham moi thanh cong")
    void testCreateProduct() {
        ProductRequestDTO productRequestDTO = new ProductRequestDTO(
                "Asus Xenos 3000",
                BigDecimal.valueOf(15000000),
                10,
                "Asus la Laptop",
                1L
        );
        ProductResponseDTO result = productService.createProduct(productRequestDTO);
        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("Asus Xenos 3000", result.getProductName());
        assertEquals(BigDecimal.valueOf(15000000), result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals("Asus la Laptop", result.getDescription());
    }

    @Test
    @DisplayName("TC2: Cap nhat thong tin san pham thanh cong")
    void testUpdateProduct() {
        ProductRequestDTO productRequestDTO = new ProductRequestDTO(
                "Dell Xenos 3000",
                BigDecimal.valueOf(20000000),
                30,
                "Dell la laptop",
                1L
        );
        ProductResponseDTO result = productService.updateProduct(1L, productRequestDTO);
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Dell Xenos 3000", result.getProductName());
        assertEquals(BigDecimal.valueOf(20000000), result.getPrice());
        assertEquals(30, result.getQuantity());
        assertEquals("Dell la laptop", result.getDescription());
    }

    @Test
    @DisplayName("TC3: Xoa san pham thanh cong")
    void testDeleteProduct() {
        ProductResponseDTO result = productService.deleteProduct(1L);
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Dell Xenos 3000", result.getProductName());
        assertEquals(BigDecimal.valueOf(15000000), result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals("Dell la laptop", result.getDescription());
    }

    @Test
    @DisplayName("TC4: Lay thong tin san pham thanh cong")
    void testGetProduct() {
        ProductResponseDTO result = productService.getProduct(1L);
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Dell Xenos 3000", result.getProductName());
        assertEquals(BigDecimal.valueOf(15000000), result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals("Dell la laptop", result.getDescription());
    }

    @Test
    @DisplayName("TC5: Lay danh sach san pham thanh cong")
    void testGetAllProduct() {
        // dbProducts đang có 2 phần tử: [Dell (index 0), Iphone (index 1)]
        assertEquals(2, dbProducts.size());

        // --- KỊCH BẢN 1: Lấy trang 0, Size 10 (Lấy hết)
        Page<ProductResponseDTO> pageResult = productService.getAllProduct(0, 10);

        // Assert
        assertNotNull(pageResult);
        assertEquals(2, pageResult.getTotalElements()); // Tổng số bản ghi trong DB giả
        assertEquals(1, pageResult.getTotalPages());    // 2 sản phẩm / size 10 = 1 trang
        assertEquals(2, pageResult.getContent().size()); // Số lượng lấy về thực tế
        assertEquals("Dell Xenos 3000", pageResult.getContent().get(0).getProductName());

        // --- KỊCH BẢN 2: Lấy trang 0, Size 1 (Chỉ lấy 1 cái đầu tiên) ---
        Page<ProductResponseDTO> pageSmall = productService.getAllProduct(0, 1);
        assertEquals(2, pageSmall.getTotalElements()); // Tổng vẫn là 2
        assertEquals(2, pageSmall.getTotalPages());    // 2 sản phẩm / size 1 = 2 trang
        assertEquals(1, pageSmall.getContent().size()); // Trang này chỉ chứa 1 cái
        assertEquals("Dell Xenos 3000", pageSmall.getContent().get(0).getProductName());

        // --- KỊCH BẢN 3: Lấy trang 1, Size 1 (Lấy cái thứ 2) ---
        Page<ProductResponseDTO> pageNext = productService.getAllProduct(1, 1);
        assertEquals(1, pageNext.getContent().size());
        assertEquals("Iphone 15", pageNext.getContent().get(0).getProductName());
    }

    @Test
    @DisplayName("TC6: Tao san pham that bai - Category khong ton tai")
    void testCreateProduct_CategoryNotFound() {
        ProductRequestDTO productRequestDTO = new ProductRequestDTO(
                "New Product",
                BigDecimal.valueOf(10000000),
                1,
                "desc",
                999L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.createProduct(productRequestDTO));
        assertEquals("Category không tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("TC7: Cap nhat san pham that bai - Product khong ton tai")
    void testUpdateProduct_ProductNotFound() {
        ProductRequestDTO productRequestDTO = new ProductRequestDTO(
                "New Product",
                BigDecimal.valueOf(10000000),
                1,
                "desc",
                1L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.updateProduct(999L, productRequestDTO));
        assertEquals("Product không tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("TC8: Cap nhat san pham that bai - Category khong ton tai")
    void testUpdateProduct_CategoryNotFound() {
        ProductRequestDTO productRequestDTO = new ProductRequestDTO(
                "New Product",
                BigDecimal.valueOf(10000000),
                1,
                "desc",
                999L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.updateProduct(1L, productRequestDTO));
        assertEquals("Category không tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("TC9: Xoa san pham that bai - Product khong ton tai")
    void testDeleteProduct_ProductNotFound() {
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.deleteProduct(999L));
        assertEquals("Product không tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("TC10: Lay san pham that bai - Product khong ton tai")
    void testGetProduct_ProductNotFound(){
        RuntimeException ex = assertThrows(RuntimeException.class, () -> productService.getProduct(999L));
        assertEquals("Product không tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("TC11: Lay danh sach san pham - Danh sach rong")
    void testGetAllProduct_EmptyList(){
        dbProducts.clear();
        Page<ProductResponseDTO> pageResult = productService.getAllProduct(0, 10);
        assertNotNull(pageResult);
        assertEquals(0, pageResult.getTotalElements());
    }

    @Test
    @DisplayName("TC12: Lay danh sach san pham khong pagination")
    void testGetAllProduct_NoPagination(){
        List<ProductResponseDTO> products = productService.getAllProduct();
        assertNotNull(products);
        assertEquals(2, products.size());
    }

    @Test
    @DisplayName("TC13: Lay danh sach san pham khong pagination - Danh sach rong")
    void testGetAllProduct_NoPagination_EmptyList(){
        dbProducts.clear();
        List<ProductResponseDTO> products = productService.getAllProduct();
        assertNull(products);
        assertEquals(0, dbProducts.size());
    }
}
