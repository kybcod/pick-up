package com.codingbackend.domain.payment;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;


@Data
public class Payment {
    private Integer id;
    private String merchantUid;
    private List<Integer> cartId;
    private LocalDateTime inserted;
}
