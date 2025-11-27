package com.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.product.ProductRequestDTO;
import com.flogin.dto.product.ProductResponseDTO;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.entity.Category;
import com.flogin.service.CategoryService;
import com.flogin.service.JwtService;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Product API Integration Tests")
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private CategoryService categoryService;

    // ==========================================================
    // a) TEST CREATE PRODUCT - POST /products
    // ==========================================================
    @Test
    @DisplayName("Create Product Success")
    void createProductSuccess() throws Exception {

        ProductRequestDTO productRequestDTO = new ProductRequestDTO(
                "Laptop DELL XPS",
                new BigDecimal("24000000"),
                10,
                "High-end Laptop",
                1L
        );

        ProductResponseDTO mockResponse = new ProductResponseDTO(
                4L,
                "Laptop DELL XPS",
                new BigDecimal("24000000"),
                10,
                "High-end Laptop",
                new Category("Laptop")
        );

        when(categoryService.existsById(1L)).thenReturn(true);
        when(productService.createProduct(any(ProductRequestDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4L))
                .andExpect(jsonPath("$.productName").value("Laptop DELL XPS"));
    }

    @Test
    @DisplayName("Create Product Fail - Category Not Found")
    void createProductFail_CategoryNotFound() throws Exception {
        ProductRequestDTO request = new ProductRequestDTO(
                "Laptop DELL XPS",
                new BigDecimal("24000000"),
                10,
                "High-end Laptop",
                99L
        );

        // Giả lập category không tồn tại
        when(categoryService.existsById(99L)).thenReturn(false);

        // Khi service tạo product thì ném lỗi
        when(productService.createProduct(any()))
                .thenThrow(new RuntimeException("Category không tồn tại"));

        // Gửi request và kiểm tra response
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Category không tồn tại"));
    }



    // ==========================================================
    // b) TEST GET ALL PRODUCTS - GET /products
    // ==========================================================
    @Test
    @DisplayName("Get All Products Success")
    void getAllProducts() throws Exception {

        List<ProductResponseDTO> mockList = Arrays.asList(
                new ProductResponseDTO(1L, "iPhone", new BigDecimal("20000000"), 5, "Apple phone", new Category("Phone")),
                new ProductResponseDTO(2L, "MacBook", new BigDecimal("30000000"), 3, "Apple laptop", new Category("Laptop"))
        );

        when(productService.getAllProduct()).thenReturn(mockList);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].productName").value("iPhone"))
                .andExpect(jsonPath("$[1].productName").value("MacBook"));
    }


    // ==========================================================
    // c) TEST GET PRODUCT - GET /products/{id}
    // ==========================================================
    @Test
    @DisplayName("Get Product By ID Success")
    void getProductById() throws Exception {

        ProductResponseDTO mockProduct = new ProductResponseDTO(
                1L,
                "iPhone",
                new BigDecimal("20000000"),
                5,
                "Apple phone",
                new Category("Phone")
        );

        when(productService.getProduct(1L)).thenReturn(mockProduct);

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.productName").value("iPhone"));
    }

    @Test
    @DisplayName("Get Product By ID Fail - Not Found")
    void getProductByIdFail_NotFound() throws Exception {

        when(productService.getProduct(99L))
                .thenThrow(new RuntimeException("Product không tồn tại"));

        mockMvc.perform(get("/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product không tồn tại"));
    }


    // ==========================================================
    // d) TEST UPDATE PRODUCT - PUT /products/{id}
    // ==========================================================
    @Test
    @DisplayName("Update Product Success")
    void updateProductSuccess() throws Exception {

        ProductRequestDTO updateRequest = new ProductRequestDTO(
                "iPhone 15 Pro",
                new BigDecimal("28000000"),
                7,
                "Latest Apple phone",
                1L
        );

        ProductResponseDTO updatedProduct = new ProductResponseDTO(
                1L,
                "iPhone 15 Pro",
                new BigDecimal("28000000"),
                7,
                "Latest Apple phone",
                new Category("Phone")
        );

        when(categoryService.existsById(1L)).thenReturn(true);
        when(productService.updateProduct(eq(1L), any(ProductRequestDTO.class))).thenReturn(updatedProduct);

        mockMvc.perform(put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("iPhone 15 Pro"));
    }

    @Test
    @DisplayName("Update Product Fail - Category Not Found")
    void updateProductFail_CategoryNotFound() throws Exception {

        ProductRequestDTO request = new ProductRequestDTO(
                "iPhone 15 Pro",
                new BigDecimal("28000000"),
                7,
                "Latest Apple phone",
                99L
        );

        // Category không tồn tại
        when(categoryService.existsById(99L)).thenReturn(false);

        // Service ném lỗi
        when(productService.updateProduct(anyLong(), any(ProductRequestDTO.class)))
                .thenThrow(new RuntimeException("Category không tồn tại"));

        mockMvc.perform(put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Category không tồn tại"));
    }




    // ==========================================================
    // e) TEST DELETE PRODUCT - DELETE /products/{id}
    // ==========================================================

    @Test
    @DisplayName("Delete Product Success")
    void deleteProduct() throws Exception {

        ProductResponseDTO deletedProduct = new ProductResponseDTO(
                1L,
                "iPhone",
                new BigDecimal("20000000"),
                5,
                "Apple phone",
                new Category("Phone")
        );

        when(productService.deleteProduct(1L)).thenReturn(deletedProduct);

        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.productName").value("iPhone"))
                .andExpect(jsonPath("$.price").value(20000000))
                .andExpect(jsonPath("$.quantity").value(5))
                .andExpect(jsonPath("$.description").value("Apple phone"))
                .andExpect(jsonPath("$.category.name").value("Phone"));
    }


    @Test
    @DisplayName("Delete Product Not Found")
    void deleteProductNotFound() throws Exception {

        when(productService.deleteProduct(99L))
                .thenThrow(new RuntimeException("Product không tồn tại"));

        mockMvc.perform(delete("/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product không tồn tại"));
    }

    // ==========================================================
    // f) TEST SEARCH PRODUCTS - GET /products/search
    // ==========================================================
    @Test
    @DisplayName("Search Products Success")
    void searchProductsSuccess() throws Exception {
        List<Product> mockProducts = Arrays.asList(
                new Product("iPhone", new BigDecimal("20000000"), 5, "Apple phone", new Category("Phone"))
        );

        when(productService.searchProductsByNameVulnerable("iPhone")).thenReturn(mockProducts);

        mockMvc.perform(get("/products/search")
                        .param("name", "iPhone"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].name").value("iPhone"));
    }

    @Test
    @DisplayName("Test SQL Injection in Search Products")
    void testSQLInjectionInSearch() throws Exception {
        // Input độc hại để thử nghiệm SQL Injection
        String maliciousInput = "'; DROP TABLE product; --";

        // Mock service trả về danh sách rỗng (mô phỏng không có kết quả hoặc lỗi)
        when(productService.searchProductsByNameVulnerable(maliciousInput)).thenReturn(Arrays.asList());

        // Thực hiện request với input độc hại
        mockMvc.perform(get("/products/search")
                        .param("name", maliciousInput))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(0));
                
    }
}
