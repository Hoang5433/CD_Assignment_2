package com.flogin.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // <--- Thêm dòng này
@Entity
@Table(name = "categories")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category extends BaseEntity{
    @Column(nullable = false, unique = true)
    private String name;
}