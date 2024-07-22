package com.codingbackend.domain.restaurant;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RestaurantRequestDto {
    private int restaurantId;
    private int userId;
    private String restaurantName;
    private String restaurantTel;
    private String address;
    private double latitude;
    private double longitude;
    private String categoryName;
    private String logo;
    private LocalDateTime inserted;
}
