package com.codingbackend.domain.payment;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class Payment {
    private Integer id;
    private String merchantUid;
    private Long restaurantId;
    private Integer userId;
    private LocalDateTime inserted;
}
