package com.codingbackend.domain.favorites;

import org.apache.ibatis.annotations.*;

@Mapper
public interface FavoriteMapper {

    @Insert("""
            INSERT INTO favorites (user_id, restaurant_id, created_at) VALUES (#{userId}, #{restaurantId}, #{createdAt})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Favorite favorite);

    @Select("""
            SELECT COUNT(*) FROM favorites WHERE restaurant_id = #{restaurantId}
            """)
    int selectByRestaurantId(Long restaurantId);

    @Delete("""
            DELETE FROM favorites WHERE restaurant_id = #{restaurantId}
            """)
    int delete(Long restaurantId);
}
