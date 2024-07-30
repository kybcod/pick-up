package com.codingbackend.domain.restaurant;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RestaurantRequestDto {
    private Long restaurantId;
    private Integer userId;
    private String restaurantName;
    private String restaurantTel;
    private String address;
    private double latitude;
    private double longitude;
    private String categoryId;
    private String logo;
    private LocalDateTime inserted;
}
