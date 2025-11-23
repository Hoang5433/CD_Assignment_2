package com.flogin.dto.product;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductRequestDTO {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, message = "Tên sản phẩm chứa ít nhất 3 kí tự")
    @Size(max = 100, message = "Tên sản phẩm chứa tối đa 100 kí tự")
    private String productName;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0",message = "Giá phải lớn hơn hoặc = 0")
    @DecimalMax(value = "999999999", message = "Giá không được quá 999,999,999")
    private BigDecimal price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc = 0")
    @Max(value = 99999, message = "Số lượng tối đa không quá 99,999")
    private int quantity;

    @Size(max = 500, message = "Mô tả không quá 500 kí tự")
    private String description;

    @NotNull(message = "Phải chọn category")
    private Long category_id;
}
