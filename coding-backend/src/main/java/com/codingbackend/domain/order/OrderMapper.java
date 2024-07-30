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
                   o.merchant_uid,
                   o.estimated_time
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

    @Update("""
            UPDATE orders
            SET pick_up_status = TRUE
            WHERE merchant_uid=#{merchantUid}
            """)
    void updatePickUpStatus(String merchantUid);

    @Select("""
            SELECT u.nick_name,
                   u.phone_number,
                   r.restaurant_id,
                   r.user_id,
                   r.restaurant_name,
                   r.logo,
                   o.user_id       AS orderUserId,
                   o.total_price,
                   o.merchant_uid,
                   o.estimated_time,
                   o.pick_up_status,
                   ou.nick_name    AS buyerName,
                   ou.phone_number AS buyerTel
            FROM user u
                     JOIN restaurant r ON u.id = r.user_id
                     JOIN orders o on r.restaurant_id = o.restaurant_id
                     JOIN user ou ON o.user_id = ou.id
            WHERE u.id = #{userId}
            """)
    List<ReceivedOrder> selectReceivedOrder(Integer userId);

    @Select("""
            SELECT COUNT(o.pick_up_status) AS orderCount
            FROM orders o
                     JOIN restaurant r ON o.restaurant_id = r.restaurant_id
            WHERE o.pick_up_status = FALSE
              AND r.user_id =#{userId}
            """)
    OrderCount selectOrderCount(Integer userId);

    @Delete("DELETE FROM orders WHERE restaurant_id=#{restaurantId}")
    int deleteOrder(Long restaurantId);
}
