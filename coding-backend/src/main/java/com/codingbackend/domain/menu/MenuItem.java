package com.codingbackend.domain.menu;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
class MenuItem {
    private String name;
    private String price;
    private MultipartFile img;  // String 대신 ImageData 사용
}
