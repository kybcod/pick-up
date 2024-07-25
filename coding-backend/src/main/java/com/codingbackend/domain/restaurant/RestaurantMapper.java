package com.codingbackend.domain.restaurant;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

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
            SELECT * FROM restaurant WHERE restaurant_id=#{restaurantId}
            """)
    Restaurant selectByRestaurantId(Long restaurantId);

    @Select("""
            SELECT * FROM restaurant WHERE user_id=#{userId}
            """)
    List<Restaurant> selectByUserId(Integer userId);

    @Update("""
            UPDATE restaurant 
            SET restaurant_name=#{restaurantName} 
                        AND restaurant_tel=#{restaurantTel} AND logo=#{logo}
            WHERE restaurant_id=#{restaurantId}
            """)
    void updateRestaurantInfo(Long restaurantId);
}
