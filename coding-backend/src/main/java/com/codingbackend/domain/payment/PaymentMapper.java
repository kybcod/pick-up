package com.codingbackend.domain.payment;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PaymentMapper {

    @Insert("INSERT INTO payment (merchant_uid, cart_id ) VALUES (#{merchantUid}, #{cartId})")
    List<Payment> insert(Payment payment);
}
