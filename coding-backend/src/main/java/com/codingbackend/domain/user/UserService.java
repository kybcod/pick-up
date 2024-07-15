package com.codingbackend.domain.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class UserService {

    final UserMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public boolean validate(User user) {

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return false;
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return false;
        }
        if (user.getPhoneNum() == null || user.getPhoneNum().isBlank()) {
            return false;
        }
        if (user.getNickName() == null || user.getNickName().isBlank()) {
            return false;
        }
        String emailPattern = "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";
        if (!user.getEmail().matches(emailPattern)) {
            return false;
        }
        String phoneNumPattern = "^010-\\d{4}-\\d{4}$";
        if (!user.getPhoneNum().matches(phoneNumPattern)) {
            return false;
        }

        else {
            return true;
        }
    }

    public void add(User user) {
        user.setEmail(user.getEmail().trim());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setNickName(user.getNickName().trim());

        mapper.inserted(user);
    }

    public User getEmail(String email) {
        return mapper.selectByEmail(email.trim());
    }

    public User getNickName(String nickName) {
        return mapper.selectByNickName(nickName.trim());
    }
}
