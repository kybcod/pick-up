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
    private int price;
    private String menu;
    private String img;

    public void setPrice(String price) {
        this.price = Integer.parseInt(price.replace(",", ""));
    }
}