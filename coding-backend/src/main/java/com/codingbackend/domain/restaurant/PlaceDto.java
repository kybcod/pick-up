package com.codingbackend.domain.restaurant;

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
}

@Data
class CategoryDto {
    private String cateid;
    private String catename;
    private String cate1name;
    private String fullCateIds;
}

@Data
class FeedbackDto {
    private Integer allphotocnt;
    private Integer blogrvwcnt;
    private Integer comntcnt;
    private Integer scoresum;
    private Integer scorecnt;
}

@Data
class MenuInfoDto {
    private Integer menucount;
    private List<MenuDto> menuList;
    private List<String> menuboardphotourlList;
}

@Data
class MenuDto {
    private String price;
    private String menu;
    private String img;
}