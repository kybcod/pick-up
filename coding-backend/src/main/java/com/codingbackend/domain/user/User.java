package com.codingbackend.domain.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
