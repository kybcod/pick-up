package com.codingbackend.domain.menu;

import lombok.Data;

import java.util.List;

@Data
public class PlaceDto {
    private BasicInfo basicInfo;
    private MenuInfoDto menuInfo;
}

@Data
class BasicInfo {
    private CategoryDto category;
    private FeedbackDto feedback;
    private String placenamefull;
    private String mainphotourl;
    private String phonenum;
}

@Data
class CategoryDto {
    private String catename;
    private String cate1name;
}

@Data
class FeedbackDto {
    private Integer scoresum;
    private Integer scorecnt;
}

@Data
class MenuInfoDto {
    private Integer menucount;
    private List<MenuDto> menuList;
}

@Data
class MenuDto {
    private String price;
    private String menu;
    private String img;

    public boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Integer.parseInt(str.replace(",", ""));
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public void setPrice(String price) {
        if (isNumeric(price)) {
            this.price = price.replace(",", "");
        } else {
            // 숫자가 아닌 경우 입력된 문자열을 그대로 사용
            this.price = price;
        }
    }
}