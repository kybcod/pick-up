package com.codingbackend.domain.restaurant;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface RestaurantMapper {

    @Insert("""
            INSERT INTO restaurant (restaurant_id, user_id, restaurant_name, restaurant_tel, address, logo, latitude, longitude)
            VALUES (#{restaurantId},#{userId}, #{restaurantName}, #{restaurantTel}, #{address}, #{logo}, #{latitude}, #{longitude})
            """)
    void insert(RestaurantRequestDto restaurant);

    @Select("SELECT COUNT(*) FROM restaurant WHERE restaurant_id = #{restaurantId}")
    int selectIsRestaurantId(Long restaurantId);

    @Update("UPDATE restaurant SET category=#{category} WHERE restaurant_id = #{restaurantId}")
    void updateCategory(Integer restaurantId, String category);

    @Select("SELECT * FROM category WHERE id = #{category}")
    Category select(Integer category);

    @Update("""
            UPDATE restaurant 
            SET logo=#{logo}
            WHERE restaurant_id=#{restaurantId}
            """)
    void updateLogo(RestaurantRequestDto restaurant);
}
