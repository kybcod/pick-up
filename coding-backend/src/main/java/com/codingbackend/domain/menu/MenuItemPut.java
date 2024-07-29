package com.codingbackend.domain.menu;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
class MenuItemPut {
    private String name;
    private String price;
    private MultipartFile img;  // String 대신 ImageData 사용
}

@Data
class ImageData {
    private String src;
    private String fileName;
}
