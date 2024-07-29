package com.codingbackend.domain.menu;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
class MenuItem {
    private Integer id;
    private Long restaurantId;
    private String name;
    private String price;
    private MultipartFile img;
    private String existingImageUrl;
}
