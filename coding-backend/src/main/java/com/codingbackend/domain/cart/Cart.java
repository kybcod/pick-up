package com.codingbackend.domain.cart;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Cart {
    private Integer id;
    private Long restaurantId;
    private Integer userId;
    private String menuName;
    private Integer menuCount;
    private Integer menuPrice;
    private LocalDateTime inserted;

    //결제
    private Boolean pickUpStatus;

    //리뷰
    private Boolean reviewStatus;

    private Integer orderId;
}
