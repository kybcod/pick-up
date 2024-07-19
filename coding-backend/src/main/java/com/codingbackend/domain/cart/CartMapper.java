package com.codingbackend.domain.cart;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CartMapper {

    @Insert("""
            INSERT INTO cart (restaurant_id, user_id, menu_name, menu_count, menu_price, total_price, payment_status)
            VALUES (#{restaurantId}, #{userId}, #{menuName}, #{menuCount}, #{menuPrice}, #{totalPrice}, FALSE)
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Cart cart);

    @Select("SELECT COUNT(*) FROM cart WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName} And user_id=#{userId} AND payment_status = FALSE")
    int selectByRestaurantIdAndMenuNameAndUserIdAndPaymentStatusFalse(Long restaurantId, String menuName, Integer userId);

    @Delete("DELETE FROM cart WHERE restaurant_id=#{restaurantId} AND user_id=#{userId}")
    int deleteByRestaurantIdAndUserId(Long restaurantId, Integer userId);

    @Select("SELECT * FROM cart WHERE user_id=#{userId} AND restaurant_id=#{restaurantId}")
    List<Cart> selectByUserIdAndRestaurantId(Integer userId, Long restaurantId);

    @Select("""
            SELECT id, restaurant_id, user_id, 
                   menu_name, menu_count, menu_price, 
                   total_price, inserted, payment_status 
            FROM cart 
            WHERE user_id=#{userId} 
              AND payment_status = FALSE
            """)
    List<Cart> selectByUserId(Integer userId);

    @Delete("DELETE FROM cart WHERE user_id=#{userId} AND restaurant_id=#{restaurantId} AND menu_name=#{menuName}")
    int deleteByUserIdAndRestaurantIdAndMenuName(Integer userId, Long restaurantId, String menuName);

    @Update("""
            UPDATE cart
            SET payment_status = TRUE
            WHERE user_id = #{userId} AND restaurant_id = #{restaurantId}
            """)
    void updateByUserIdAndRestaurantId(Integer userId, Long restaurantId);


    @Select("""
            SELECT id, restaurant_id, user_id, 
                   menu_name, menu_count, menu_price, 
                   total_price, inserted, payment_status 
            FROM cart 
            WHERE user_id=#{userId} 
              AND restaurant_id=#{restaurantId} 
              AND payment_status = FALSE
            """)
    List<Cart> selectByUserIdAndRestaurantIdAndPaymentStatus(Integer userId, Long restaurantId);

    @Select("""
            SELECT c.id,
                    c.restaurant_id,
                    c.user_id,
                    c.menu_name,
                    c.menu_count,
                    c.menu_price,
                    c.total_price,
                    c.inserted,
                    c.payment_status,
                    o.pick_up_status,
                    o.review_status
             FROM cart c
                      JOIN orders o ON c.restaurant_id = o.restaurant_id
             WHERE c.user_id = #{userId}
               AND c.payment_status = TRUE
            """)
    List<Cart> selectByUserIdAndPaymentStatusTrue(Integer userId);
}
