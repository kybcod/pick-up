package com.codingbackend.domain.order;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;


@Data
public class Order {
    private Integer id;
    private String merchantUid;
    private Long restaurantId;
    private Integer userId;
    private LocalDateTime inserted;
    private Boolean pickUpStatus;
    private Integer totalPrice;
    private List<Integer> cartIds;
}
