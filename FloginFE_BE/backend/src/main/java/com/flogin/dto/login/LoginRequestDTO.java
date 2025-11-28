package com.flogin.dto.login;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequestDTO {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 3, message = "Tên đăng nhập chứa ít nhất 3 ký tự")
    @Size(max = 50, message = "Tên đăng nhập chứa tối đa 50 kí tự")
    @Pattern(
            regexp = "^[a-zA-Z0-9._-]+$",
            message = "Username chỉ được chứa chữ, số, dấu gạch ngang (-), gạch dưới (_) hoặc dấu chấm (.)"
    )
    private String username;
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải chứa ít nhất 6 ký tự ")
    @Size(max = 100, message = "Mật khẩu chỉ chứa tối đa 100 ký tự")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Mật khẩu phải có cả chữ và số"
    )
    private String password;
}
