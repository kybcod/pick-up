package com.codingbackend.domain.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentMapper paymentMapper;

    public void insert(Payment payment) {
        paymentMapper.insert(payment);
    }
}
