package com.codingbackend.domain.menu;

import lombok.Data;

import java.util.List;

@Data
public class MenuRequestPut {
    private Long restaurantId;
    private List<MenuItem> menuItems;

}
