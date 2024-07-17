package com.codingbackend.domain.payment;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentMapper {

    @Insert("""
            INSERT INTO payment (merchant_uid, restaurant_id, user_id)
            VALUES (#{merchantUid}, #{restaurantId}, #{userId})
            """)
    int insert(Payment payment);
}
