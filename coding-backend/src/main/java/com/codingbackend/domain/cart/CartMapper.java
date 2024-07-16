package com.codingbackend.domain.cart;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CartMapper {

    @Insert("""
            INSERT INTO cart (restaurant_id, user_id, menu_name, menu_count, menu_price, total_price)
            VALUES (#{restaurantId}, #{userId}, #{menuName}, #{menuCount}, #{menuPrice}, #{totalPrice})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Cart cart);

    @Select("SELECT COUNT(*) FROM cart WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName} And user_id=#{userId}")
    int selectByRestaurantIdAndMenuName(Long restaurantId, String menuName, Integer userId);

    @Update("""
            UPDATE cart
            SET menu_count = #{menuCount}, total_price = #{totalPrice}
            WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName}
            """)
    void update(Cart cart);

    @Delete("DELETE FROM cart WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName} AND user_id=#{userId}")
    int deleteByRestaurantIdAndMenuName(Long restaurantId, String menuName, Integer userId);

    @Select("SELECT * FROM cart WHERE user_id=#{userId} And restaurant_id=#{restaurantId}")
    List<Cart> selectByUserIdAndRestaurantId(Integer userId, Long restaurantId);

    @Select("SELECT * FROM cart WHERE user_id=#{userId}")
    List<Cart> selectByUserId(Integer userId);
}
