package com.codingbackend.domain.review;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReviewRequest {
    private Integer id;
    private Long restaurantId;
    private Integer userId;
    private Integer rating;
    private Integer reviewCount;
    private Integer reviewSum;
    private String content;
    private LocalDateTime inserted;
    private List<ReviewFile> fileList;

    private Integer sellerId;
    private String restaurantName;
    private String restaurantTel; //전화번호
    private String address;
    private String logo;
}
