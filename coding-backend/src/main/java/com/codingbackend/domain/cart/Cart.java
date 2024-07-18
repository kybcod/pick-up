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
    private String menuPrice;
    private String totalPrice;
    private Boolean paymentStatus;
    private LocalDateTime inserted;

    //결제
    private Boolean pickUpStatus;
}
