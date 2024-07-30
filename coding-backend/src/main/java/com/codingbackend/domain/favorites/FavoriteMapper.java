package com.codingbackend.domain.favorites;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FavoriteMapper {

    @Insert("""
            INSERT INTO favorites (user_id, restaurant_id) 
            VALUES (#{userId}, #{restaurantId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Favorite favorite);

    @Select("""
            SELECT COUNT(*) FROM favorites WHERE restaurant_id = #{restaurantId} AND user_id=#{userId}
            """)
    int selectByRestaurantId(Long restaurantId, Integer userId);

    @Delete("""
            DELETE FROM favorites WHERE restaurant_id = #{restaurantId} AND user_id=#{userId}
            """)
    int delete(Long restaurantId, Integer userId);

    @Select("SELECT * FROM favorites WHERE user_id=#{userId}")
    List<Favorite> getAllByUserId(Integer userId);

    @Select("SELECT * FROM favorites WHERE restaurant_id = #{restaurantId} AND user_id=#{userId} ")
    List<Favorite> getByRestaurantIdAndUserId(Long restaurantId, Integer userId);

    @Delete("DELETE FROM favorites WHERE restaurant_id=#{restaurantId}")
    int deleteFavorite(Long restaurantId);

}
