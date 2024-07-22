package com.codingbackend.domain.menu;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MenuMapper {
    @Insert("""
            INSERT INTO menu (restaurant_id, name, price, img)
            VALUES (#{restaurantId}, #{name}, #{price}, #{img})
            """)
    void insert(Menu menu);
}
