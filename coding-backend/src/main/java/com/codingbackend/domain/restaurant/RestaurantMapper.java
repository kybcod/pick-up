package com.codingbackend.domain.restaurant;

import com.codingbackend.domain.menu.MenuRestaurant;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RestaurantMapper {

    @Insert("""
            INSERT INTO restaurant (restaurant_id, user_id, restaurant_name, restaurant_tel, address, logo, latitude, longitude, category_id)
            VALUES (#{restaurantId},#{userId}, #{restaurantName}, #{restaurantTel}, #{address}, #{logo}, #{latitude}, #{longitude}, #{categoryId})
            """)
    void insert(RestaurantRequestDto restaurant);

    @Select("SELECT * FROM category WHERE id = #{category}")
    Category selectCategory(Integer category);

    @Update("""
            UPDATE restaurant 
            SET logo=#{logo}
            WHERE restaurant_id=#{restaurantId}
            """)
    void updateLogo(Restaurant restaurant);

    @Select("SELECT * FROM restaurant")
    List<RestaurantRequestDto> selectAll();

    @Select("""
            SELECT *
            FROM restaurant 
            WHERE restaurant_id = #{restaurantId}
            """)
    Restaurant selectByRestaurantId(Long restaurantId);

    @Select("""
            SELECT * FROM restaurant WHERE user_id=#{userId}
            """)
    List<Restaurant> selectByUserId(Integer userId);


    @Delete("DELETE FROM restaurant WHERE restaurant_id=#{restaurantId}")
    int deleteRestaurant(Long restaurantId);

    @Update("""
            UPDATE restaurant
            SET restaurant_name = #{restaurantName}, 
                restaurant_tel = #{restaurantTel}, 
                logo = #{logoFileName}
            WHERE restaurant_id = #{restaurantId}
            """)
    void updateRestaurantInfo(MenuRestaurant menuRestaurant);

    @Update("""
            UPDATE restaurant
            SET restaurant_name = #{restaurantName}, 
                restaurant_tel = #{restaurantTel}, 
                logo = #{logo},
                user_id=#{userId},
                restaurant_id = #{restaurantId},
                category_id = #{categoryId},
                address = #{address},
                latitude = #{latitude},
                longitude = #{longitude}
            WHERE restaurant_id = #{restaurantId}
            """)
    void updateRestaurant(Restaurant restaurant);
}
