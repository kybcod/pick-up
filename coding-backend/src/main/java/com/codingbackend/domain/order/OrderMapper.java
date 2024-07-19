package com.codingbackend.domain.order;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface OrderMapper {

    @Insert("""
            INSERT INTO orders (merchant_uid, restaurant_id, user_id, pick_up_status, review_status)
            VALUES (#{merchantUid}, #{restaurantId}, #{userId}, FALSE, FALSE)
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Order order);

    @Update("""
            UPDATE orders
            SET review_status = TRUE
            WHERE user_id=#{userId} AND restaurant_id = #{restaurantId}
            """)
    void updateReviewStatus(Integer userId, Long restaurantId);
}
