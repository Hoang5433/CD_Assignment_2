package com.flogin.MockTest;

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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // TEST CREATE PRODUCT
    @Test
    @DisplayName("Create Product Success - Mock Repository")
    void testCreateProductSuccess() {

        ProductRequestDTO request = new ProductRequestDTO(
                "Laptop DELL XPS",
                new BigDecimal("24000000"),
                10,
                "High-end Laptop",
                1L
        );

        Category mockCategory = new Category("Laptop");
        mockCategory.setId(1L);

        Product savedProduct = new Product("Laptop DELL XPS", new BigDecimal("24000000"), 10, "High-end Laptop", mockCategory);
        savedProduct.setId(4L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(4L);
            return p;
        });

        ProductResponseDTO result = productService.createProduct(request);

        assertNotNull(result);
        assertEquals(4L, result.getId());
        assertEquals("Laptop DELL XPS", result.getProductName());
        assertEquals(new BigDecimal("24000000"), result.getPrice());

        verify(categoryRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Create Product Fail - Category Not Found")
    void testCreateProductFail_CategoryNotFound() {

        ProductRequestDTO request = new ProductRequestDTO(
                "Laptop DELL XPS",
                new BigDecimal("24000000"),
                10,
                "High-end Laptop",
                99L
        );

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());


        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.createProduct(request));
        assertEquals("Category không tồn tại", exception.getMessage());

        verify(categoryRepository, times(1)).findById(99L);
        verify(productRepository, never()).save(any(Product.class));
    }

    // b) TEST GET PRODUCT BY ID

    @Test
    @DisplayName("Get Product By ID Success - Mock Repository")
    void testGetProductByIdSuccess() {

        Long productId = 1L;
        Category mockCategory = new Category("Phone");
        mockCategory.setId(1L);

        Product mockProduct = new Product("iPhone", new BigDecimal("20000000"), 5, "Apple phone", mockCategory);
        mockProduct.setId(productId);

        ProductResponseDTO expectedResponse = new ProductResponseDTO(
                productId, "iPhone", new BigDecimal("20000000"), 5, "Apple phone", mockCategory);

        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));
        when(productMapper.toProductResponseDTO(mockProduct)).thenReturn(expectedResponse);


        ProductResponseDTO result = productService.getProduct(productId);


        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("iPhone", result.getProductName());

        verify(productRepository, times(1)).findById(productId);
        verify(productMapper, times(1)).toProductResponseDTO(mockProduct);
    }

    @Test
    @DisplayName("Get Product By ID Fail - Not Found")
    void testGetProductByIdFail_NotFound() {

        Long productId = 99L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.getProduct(productId));
        assertEquals("Product không tồn tại", exception.getMessage());

        verify(productRepository, times(1)).findById(productId);
        verify(productMapper, never()).toProductResponseDTO(any(Product.class));
    }

    // c) TEST GET ALL PRODUCTS

    @Test
    @DisplayName("Get All Products Success - Mock Repository")
    void testGetAllProductsSuccess() {

        Category phoneCategory = new Category("Phone");
        phoneCategory.setId(1L);
        Category laptopCategory = new Category("Laptop");
        laptopCategory.setId(2L);

        List<Product> mockProducts = Arrays.asList(
                new Product("iPhone", new BigDecimal("20000000"), 5, "Apple phone", phoneCategory),
                new Product("MacBook", new BigDecimal("30000000"), 3, "Apple laptop", laptopCategory)
        );
        mockProducts.get(0).setId(1L);
        mockProducts.get(1).setId(2L);

        List<ProductResponseDTO> expectedResponses = Arrays.asList(
                new ProductResponseDTO(1L, "iPhone", new BigDecimal("20000000"), 5, "Apple phone", phoneCategory),
                new ProductResponseDTO(2L, "MacBook", new BigDecimal("30000000"), 3, "Apple laptop", laptopCategory)
        );

        when(productRepository.findAll()).thenReturn(mockProducts);
        when(productMapper.toProductResponseDTO(mockProducts.get(0))).thenReturn(expectedResponses.get(0));
        when(productMapper.toProductResponseDTO(mockProducts.get(1))).thenReturn(expectedResponses.get(1));

        List<ProductResponseDTO> result = productService.getAllProduct();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("iPhone", result.get(0).getProductName());
        assertEquals("MacBook", result.get(1).getProductName());

        verify(productRepository, times(1)).findAll();
        verify(productMapper, times(2)).toProductResponseDTO(any(Product.class));
    }

    @Test
    @DisplayName("Get All Products Empty - Mock Repository")
    void testGetAllProductsEmpty() {

        when(productRepository.findAll()).thenReturn(Arrays.asList());

        List<ProductResponseDTO> result = productService.getAllProduct();

        assertNull(result);

        verify(productRepository, times(1)).findAll();
        verify(productMapper, never()).toProductResponseDTO(any(Product.class));
    }

    // d) TEST UPDATE PRODUCT

    @Test
    @DisplayName("Update Product Success - Mock Repository")
    void testUpdateProductSuccess() {

        Long productId = 1L;
        ProductRequestDTO updateRequest = new ProductRequestDTO(
                "iPhone 15 Pro",
                new BigDecimal("28000000"),
                7,
                "Latest Apple phone",
                1L
        );

        Category mockCategory = new Category("Phone");
        mockCategory.setId(1L);

        Product existingProduct = new Product("iPhone", new BigDecimal("20000000"), 5, "Apple phone", mockCategory);
        existingProduct.setId(productId);

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            return p;
        });


        ProductResponseDTO result = productService.updateProduct(productId, updateRequest);

        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("iPhone 15 Pro", result.getProductName());

        verify(productRepository, times(1)).findById(productId);
        verify(categoryRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(existingProduct);
    }

    @Test
    @DisplayName("Update Product Fail - Product Not Found")
    void testUpdateProductFail_ProductNotFound() {

        Long productId = 99L;
        ProductRequestDTO updateRequest = new ProductRequestDTO(
                "iPhone 15 Pro",
                new BigDecimal("28000000"),
                7,
                "Latest Apple phone",
                1L
        );

        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.updateProduct(productId, updateRequest));
        assertEquals("Product không tồn tại", exception.getMessage());


        verify(productRepository, times(1)).findById(productId);
        verify(categoryRepository, never()).findById(anyLong());
        verify(productRepository, never()).save(any(Product.class));
    }

    // e) TEST DELETE PRODUCT

    @Test
    @DisplayName("Delete Product Success - Mock Repository")
    void testDeleteProductSuccess() {

        Long productId = 1L;
        Category mockCategory = new Category("Phone");
        mockCategory.setId(1L);

        Product existingProduct = new Product("iPhone", new BigDecimal("20000000"), 5, "Apple phone", mockCategory);
        existingProduct.setId(productId);

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));

        ProductResponseDTO result = productService.deleteProduct(productId);

        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("iPhone", result.getProductName());

        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, times(1)).delete(existingProduct);
    }

    @Test
    @DisplayName("Delete Product Fail - Not Found")
    void testDeleteProductFail_NotFound() {

        Long productId = 99L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> productService.deleteProduct(productId));
        assertEquals("Product không tồn tại", exception.getMessage());

        verify(productRepository, times(1)).findById(productId);
        verify(productRepository, never()).delete(any(Product.class));
    }
}