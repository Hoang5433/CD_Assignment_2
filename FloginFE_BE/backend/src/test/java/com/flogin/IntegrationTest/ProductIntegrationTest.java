package com.flogin.IntegrationTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.controller.ProductController;
import com.flogin.dto.product.ProductRequestDTO;
import com.flogin.dto.product.ProductResponseDTO;
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
@DisplayName("Product API Endpoint Tests")
public class ProductIntegrationTest {

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
    @DisplayName("POST /api/products - SUCCESS - Tạo sản phẩm mới thành công")
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
    @DisplayName("POST /api/products - FAILED - Category không tồn tại")
    void createProductFail_CategoryNotFound() throws Exception {
        ProductRequestDTO request = new ProductRequestDTO(
                "Laptop DELL XPS",
                new BigDecimal("24000000"),
                10,
                "High-end Laptop",
                99L
        );

        when(categoryService.existsById(99L)).thenReturn(false);
        when(productService.createProduct(any()))
                .thenThrow(new RuntimeException("Category không tồn tại"));

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
    @DisplayName("GET /api/products - SUCCESS - Lấy danh sách tất cả sản phẩm thành công")
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
    @DisplayName("GET /api/products/{id} - SUCCESS - Lấy sản phẩm theo ID thành công")
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
    @DisplayName("GET /api/products/{id} - FAILED - id không tồn tại")
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
    @DisplayName("PUT /api/products/{id} - SUCCESS - Cập nhật sản phẩm thành công")
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
    @DisplayName("PUT /api/products/{id} - FAILED - Category không tồn tại")
    void updateProductFail_CategoryNotFound() throws Exception {

        ProductRequestDTO request = new ProductRequestDTO(
                "iPhone 15 Pro",
                new BigDecimal("28000000"),
                7,
                "Latest Apple phone",
                99L
        );

        when(categoryService.existsById(99L)).thenReturn(false);
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
    @DisplayName("DELETE /api/products/{id} - SUCCESS - Xóa sản phẩm thành công")
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
    @DisplayName("DELETE /api/products/{id} - FAILED - id Không tồn tại")
    void deleteProductNotFound() throws Exception {

        when(productService.deleteProduct(99L))
                .thenThrow(new RuntimeException("Product không tồn tại"));

        mockMvc.perform(delete("/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product không tồn tại"));
    }
}
