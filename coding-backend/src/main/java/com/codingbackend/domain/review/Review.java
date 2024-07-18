package com.codingbackend.domain.review;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Review {
    private Integer id;
    private Long restaurantId;
    private Integer userId;
    private Integer rating;
    private String content;
    private LocalDateTime inserted;
}

@Data
class ReviewFile {
    private Integer id;
    private Integer reviewId;
    private String fileName;
}