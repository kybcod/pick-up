package com.codingbackend.domain.cart;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CartMapper {

    @Insert("""
            INSERT INTO cart (restaurant_id, user_id, menu_name, menu_count, menu_price, order_id)
            VALUES (#{restaurantId}, #{userId}, #{menuName}, #{menuCount}, #{menuPrice}, #{orderId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Cart cart);

    @Select("SELECT COUNT(*) FROM cart WHERE restaurant_id=#{restaurantId} AND menu_name = #{menuName} And user_id=#{userId} AND order_id IS NULL")
    int selectByRestaurantIdAndMenuNameAndUserIdAndOrderId(Long restaurantId, String menuName, Integer userId);

    @Delete("DELETE FROM cart WHERE restaurant_id=#{restaurantId} AND user_id=#{userId} AND order_id IS NULL")
    int deleteByRestaurantIdAndUserId(Long restaurantId, Integer userId);

    @Select("SELECT * FROM cart WHERE user_id=#{userId} AND restaurant_id=#{restaurantId}")
    List<Cart> selectByUserIdAndRestaurantId(Integer userId, Long restaurantId);

    @Select("""
            SELECT id, restaurant_id, user_id, 
                   menu_name, menu_count, menu_price, 
                   inserted, order_id
            FROM cart 
            WHERE user_id=#{userId} 
              AND order_id IS NULL
            """)
    List<Cart> selectByUserId(Integer userId);

    @Delete("DELETE FROM cart WHERE user_id=#{userId} AND restaurant_id=#{restaurantId} AND menu_name=#{menuName}")
    int deleteByUserIdAndRestaurantIdAndMenuName(Integer userId, Long restaurantId, String menuName);

    @Select("""
            SELECT id, restaurant_id, user_id, 
                   menu_name, menu_count, menu_price, 
                   inserted, order_id
            FROM cart 
            WHERE user_id=#{userId} 
              AND restaurant_id=#{restaurantId} 
              AND order_id IS NULL
            """)
    List<Cart> selectByUserIdAndRestaurantIdAndPaymentStatus(Integer userId, Long restaurantId);

    @Select("""
            SELECT c.id,
                    c.restaurant_id,
                    c.user_id,
                    c.menu_name,
                    c.menu_count,
                    c.menu_price,
                    c.inserted,
                    c.order_id,
                    o.estimated_time,
                    o.pick_up_status,
                    o.review_status
             FROM cart c
             JOIN orders o ON c.order_id = o.id
             WHERE c.user_id = #{userId}
            """)
    List<Cart> selectOrdersByUserId(Integer userId);

    @Update({"""
            <script>
            UPDATE cart
            SET order_id=#{orderId}
            WHERE id IN
            <foreach item='id' collection='cartIds' open='(' separator=',' close=')'>
            #{id}
            </foreach>
            </script>
            """
    })
    void updateOrderId(Integer orderId, List<Integer> cartIds);


}
