package com.codingbackend.domain.user;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class User {
    private Integer id;
    private String email;
    private String password;
    private String prevPassword;
    private String phoneNum;
    private String nickName;
    private String address;
    private LocalDateTime inserted;

    private List<Authority> authorities;
}
