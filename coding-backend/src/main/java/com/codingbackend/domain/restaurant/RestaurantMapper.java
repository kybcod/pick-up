package com.codingbackend.domain.restaurant;

import org.apache.ibatis.annotations.*;
import org.springframework.web.multipart.MultipartFile;

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
    void updateLogo(RestaurantRequestDto restaurant);

    @Select("SELECT * FROM restaurant")
    List<RestaurantRequestDto> selectAll();

    @Select("""
            SELECT *
            FROM restaurant WHERE restaurant_id = #{restaurantId}
            """)
    Restaurant selectByRestaurantId(Long restaurantId);

    @Select("""
            SELECT * FROM restaurant WHERE user_id=#{userId}
            """)
    List<Restaurant> selectByUserId(Integer userId);

    @Update("""
            UPDATE restaurant
            SET restaurant_name = #{restaurantName}, 
                restaurant_tel = #{restaurantTel}, 
                logo = #{logoFileName}
            WHERE restaurant_id = #{restaurantId}
            """)
    void updateRestaurantInfo(Long restaurantId, String restaurantName, String restaurantTel,
                              @Param("logoFileName") MultipartFile logoFileName);

    @Delete("DELETE FROM restaurant WHERE restaurant_id=#{restaurantId}")
    int deleteRestaurant(Long restaurantId);
}
