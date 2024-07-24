package com.codingbackend.domain.order;

import lombok.Data;

@Data
public class ReceivedOrder {

    private Long restaurantId;
    private Integer userId;
    private String restaurantName;
    private String logo;

    private Integer orderUserId;
    private Integer totalPrice;
    private String merchantUid;
    private String estimatedTime;
    private Boolean pickUpStatus;


    private String nickName;
    private String phoneNumber;

    private String buyerName;
    private String buyerTel;


}
