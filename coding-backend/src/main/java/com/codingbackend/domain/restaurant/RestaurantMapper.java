package com.codingbackend.domain.restaurant;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface RestaurantMapper {

    @Insert("""
                    INSERT INTO restaurant (restaurant_id, restaurant_name, restaurant_number, address)
                    VALUES (#{restaurantId}, #{restaurantName}, #{restaurantNumber}, #{address})
            """)
    void insert(Restaurant restaurant);

    @Select("SELECT COUNT(*) FROM restaurant WHERE restaurant_id = #{restaurantId}")
    int selectIsRestaurantId(Long restaurantId);
}
