package com.codingbackend.domain.menu;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MenuMapper {
    @Insert("""
            INSERT INTO menu (restaurant_id, name, price, img)
            VALUES (#{restaurantId}, #{name}, #{price}, #{img})
            """)
    void insert(Menu menu);

    @Select("""
            SELECT *
            FROM menu
            WHERE restaurant_id = #{placeId}
            """)
    List<Menu> selectMenu(Long placeId);

    @Update("UPDATE menu SET name = #{name}, price = #{price}, img = #{img} WHERE restaurant_id = #{restaurantId} AND name = #{name}")
    void update(Menu menu);

    @Delete("DELETE FROM menu WHERE restaurant_id=#{restaurantId}")
    int deleteMenu(Long restaurantId);
}
