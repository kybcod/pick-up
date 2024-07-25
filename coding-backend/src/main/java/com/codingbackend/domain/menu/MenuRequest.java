package com.codingbackend.domain.menu;

import lombok.Data;

import java.util.List;

@Data
public class MenuRequest {
    private Long restaurantId;
    private List<MenuItem> menuItems;

}

