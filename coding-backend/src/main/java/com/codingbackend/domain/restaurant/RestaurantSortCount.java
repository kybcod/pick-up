package com.codingbackend.domain.restaurant;

import lombok.Data;

@Data
public class RestaurantSortCount {
    private Long restaurantId;
    private Integer favoriteCount;
    private Integer orderCount;

}
