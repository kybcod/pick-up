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
    int deleteReview(Long restaurantId);

    @Select("SELECT * FROM review_file WHERE review_id=#{reviewId}")
    List<ReviewFileRequest> selectReviewFile(Integer reviewId);

    @Select("""
            SELECT rv.id,
                   rv.restaurant_id,
                   rv.user_id,
                   rv.rating,
                   rv.content,
                   rv.inserted,
                   r.restaurant_name,
                   r.restaurant_tel,
                   r.address,
                   r.logo
            FROM review rv
                     JOIN restaurant r on rv.restaurant_id = r.restaurant_id
            WHERE r.user_id =#{userId} AND r.restaurant_id=#{restaurantId}
            """)
    List<ReviewRequest> selectSellerAllReviews(Integer userId, Long restaurantId);

    @Delete("DELETE FROM review_file WHERE review_id=#{id}")
    int deleteFileReview(Integer id);
}
