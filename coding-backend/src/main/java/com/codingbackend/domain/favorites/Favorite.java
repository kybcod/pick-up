package com.codingbackend.domain.favorites;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Favorite {
    private Integer id;
    private Integer userId;
    private Long restaurantId;
    private LocalDateTime createdAt;
}
