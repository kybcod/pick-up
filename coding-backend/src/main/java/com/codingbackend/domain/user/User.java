package com.codingbackend.domain.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {
    private Integer id;
    private String email;
    private String password;
    private String nickName;
    private String address;
    private LocalDateTime inserted;
}
