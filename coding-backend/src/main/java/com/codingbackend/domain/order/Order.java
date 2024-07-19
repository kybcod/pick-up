package com.codingbackend.domain.order;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class Order {
    private Integer id;
    private String merchantUid;
    private Long restaurantId;
    private Integer userId;
    private LocalDateTime inserted;
    private Boolean pickUpStatus;
}
