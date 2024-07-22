package com.codingbackend.domain.menu;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
public class Menu {
    private Integer id;
    private Long restaurantId;
    private String name;
    private String price;
    private String img;
    private LocalDateTime inserted;
}

@Data
class MenuRequest {
    private Long restaurantId;
    private List<MenuItem> menuItems;

}

@Data
class MenuItem {
    private String name;
    private String price;
    private String img;
}