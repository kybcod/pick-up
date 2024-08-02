package com.codingbackend.domain.user;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Insert("""
            INSERT INTO user (email, password, phone_number, nick_name, address)
            VALUES           (#{email}, #{password}, #{phoneNum}, #{nickName}, #{address});
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void inserted(User user);

    @Insert("""
            INSERT INTO authority (user_id, name)
            VALUES                (#{userId}, #{name});
            """)
    void insertedAuthority(Authority authority);

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
            SELECT name
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

    @Delete("""
            DELETE FROM authority
            WHERE user_id = #{id}
            """)
    void deleteAuthorityById(Integer id);

    @Delete("""
            DELETE FROM user
            WHERE id = #{id}
            """)
    void deleteById(Integer id);

    @Select("""
            SELECT id, email, nick_name, inserted
            FROM user
            """)
    List<User> getUserList();
}
