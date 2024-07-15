package com.codingbackend.domain.user;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Insert("""
            INSERT INTO user (email, password, phone_number, nick_name)
            VALUES          (#{email}, #{password}, #{phoneNum}, #{nickName});
            """)
    void inserted(User user);

    @Select("""
            SELECT *
            FROM  user
            WHERE email = #{email};
            """)
    User selectByEmail(String email);

    @Select("""
            SELECT *
            FROM user
            WHERE nick_name = #{nickName};
            """)
    User selectByNickName(String nickName);
}
