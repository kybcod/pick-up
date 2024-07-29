package com.codingbackend.domain.menu;

import lombok.Data;

@Data
class MenuItemPut {
    private String name;
    private String price;
    private ImageData img;  // String 대신 ImageData 사용
}

@Data
class ImageData {
    private String dataUrl;
    private String fileName;
}
