package com.codingbackend.domain.review;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReviewMapper {

    @Insert("""
            INSERT INTO review (restaurant_id, user_id, rating, content)
            VALUES (#{restaurantId}, #{userId}, #{rating}, #{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Review review);

    @Insert("""
            INSERT INTO review_file (review_id, file_name)
            VALUES (#{reviewId}, #{fileName})
            """)
    int insertFile(Integer reviewId, String fileName);

    @Select("SELECT * FROM review WHERE user_id=#{userId}")
    List<Review> selectAllReviews(Integer userId);

    @Select("SELECT file_name FROM review_file WHERE review_id=#{id}")
    List<String> selectFileNamesByReviewId(Integer id);

    @Select("""
            SELECT SUM(rating) AS reviewSum, COUNT(*) AS reviewCount
            FROM review
            WHERE restaurant_id =#{restaurantId}
            """)
    Review selectReviewByRestaurantId(Long restaurantId);

    @Select("""
            SELECT *
            FROM review
            WHERE restaurant_id = #{restaurantId}
            """)
    List<Review> selectByRestaurantId(Long restaurantId);

    @Delete("DELETE FROM review WHERE restaurant_id=#{restaurantId}")
    int deleteReview(Integer restaurantId);

    @Select("SELECT * FROM review_file WHERE review_id=#{reviewId}")
    List<ReviewFile> selectReviewFile(Integer reviewId);
}
