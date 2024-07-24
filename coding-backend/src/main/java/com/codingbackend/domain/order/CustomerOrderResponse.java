package com.codingbackend.domain.order;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CustomerOrderResponse {
    private Long restaurantId;
    private Integer userId;
    private String menuName;
    private Integer menuCount;
    private Integer menuPrice;
    private LocalDateTime inserted;
    private Integer orderId;
    private Integer totalPrice;
    private String merchantUid;
    private String estimatedTime;
}
