package com.codingbackend.domain.seller;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SellerMapper {

    @Select("""
            SELECT u.nick_name,
                   u.phone_number,
                   r.restaurant_id,
                   r.user_id,
                   r.restaurant_name,
                   r.logo,
                   o.user_id       AS orderUserId,
                   ou.nick_name    AS buyerName,
                   ou.phone_number AS buyerTel
            FROM user u
                     JOIN restaurant r ON u.id = r.user_id
                     JOIN orders o on r.restaurant_id = o.restaurant_id
                     JOIN user ou ON o.user_id = ou.id
            WHERE u.id = #{userId}
            """)
    List<ReceivedOrder> selectReceivedOrder(Integer userId);
}
