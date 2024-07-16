package com.codingbackend.domain.menu;

import lombok.Builder;
import lombok.Data;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Builder
@Data
public class Menu {
    private Integer id;
    private Long restaurant_id;
    private String name;
    private String price;
    private String img;
    private LocalDateTime inserted;
}
