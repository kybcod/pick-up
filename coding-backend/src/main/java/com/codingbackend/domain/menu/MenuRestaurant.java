package com.codingbackend.domain.menu;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class MenuRestaurant {
    //가게 정보
    private Integer id;
    private Long restaurantId;
    private Integer userId;
    private String restaurantName;
    private String restaurantTel; //전화번호
    private String address;
    private MultipartFile logo;

    //메뉴
    private List<MenuItem> menuItems;
}
