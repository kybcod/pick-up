package com.codingbackend.domain.review;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

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
}
