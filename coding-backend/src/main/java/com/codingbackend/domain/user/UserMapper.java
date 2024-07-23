package com.codingbackend.domain.user;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface UserMapper {

    @Insert("""
            INSERT INTO user (email, password, phone_number, nick_name, address)
            VALUES           (#{email}, #{password}, #{phoneNum}, #{nickName}, #{address});
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

    @Select("""
            SELECT *
            FROM authority
            WHERE user_id = #{userId}
            """)
    List<String> selectAuthorityByUserId(Integer userId);

    @Select("""
            SELECT id, email, password, nick_name
            FROM user
            WHERE id = #{id}
            """)
    User selectById(Integer id);

    @Update("""
            UPDATE user
            SET password = #{password}
                , nick_name = #{nickName}
            WHERE id = #{id}
            """)
    void update(User user);
}
