package com.codingbackend.domain.order;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OrderMapper {

    @Insert("""
            INSERT INTO orders (merchant_uid, restaurant_id, user_id, pick_up_status, review_status, total_price)
            VALUES (#{merchantUid}, #{restaurantId}, #{userId}, FALSE, FALSE, #{totalPrice})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Order order);

    @Update("""
            UPDATE orders
            SET review_status = TRUE
            WHERE user_id=#{userId} AND restaurant_id = #{restaurantId}
            """)
    void updateReviewStatus(Integer userId, Long restaurantId);

    @Select("""
            SELECT 
                   c.restaurant_id,
                   c.user_id,
                   c.menu_name,
                   c.menu_count,
                   c.menu_price,
                   c.inserted,
                   c.order_id,
                   o.total_price,
                   o.merchant_uid
            FROM cart c
                     JOIN orders o ON c.order_id = o.id
            WHERE c.user_id = #{userId}
              AND o.merchant_uid = #{merchantUid}
            """)
    List<CustomerOrderResponse> selectCustomerOrderByUserIdAndMerchantUid(Integer userId, String merchantUid);

    @Update("""
            UPDATE orders
            SET estimated_time = #{estimatedTime}
            WHERE merchant_uid=#{merchantUid}
            """)
    void updateEstimatedTime(String estimatedTime, String merchantUid);
}
