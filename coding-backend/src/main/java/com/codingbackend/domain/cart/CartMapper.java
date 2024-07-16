package com.codingbackend.domain.cart;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CartMapper {

    @Insert("""
            INSERT INTO (restaurant_id, user_id, menu_name, menu_count, menu_price, total_price)
            VALUES (#{restaurantId}, #{userId}, #{menuName},#{menuCount},#{menuPrice},#{totalPrice} )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Cart cart);

    @Select("SELECT * FROM cart WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName} ")
    int selectByRestaurantIdAndMenuName(Long restaurantId, String menuName);

    @Update("""
            UPDATE cart
            SET menu_count = #{menuCount} AND total_count=#{totalCount}
            WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName}
            """)
    void update(Cart cart);

    @Delete("DELETE FROM cart WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName} ")
    int deleteByRestaurantIdAndMenuName(Long restaurantId, String menuName);

    @Select("SELECT * FROM cart")
    List<Cart> selectAll();
}
