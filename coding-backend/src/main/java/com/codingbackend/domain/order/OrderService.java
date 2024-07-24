package com.codingbackend.domain.order;

import com.codingbackend.domain.cart.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class OrderService {
    private final OrderMapper orderMapper;
    private final CartMapper cartMapper;

    public void insert(Order order) {
        if (orderMapper.insert(order) == 1) {
            cartMapper.updateOrderId(order.getId(), order.getCartIds());
        }
    }

    public List<CustomerOrderResponse> getCustomerOrderList(Integer userId, String merchantUid) {
        return orderMapper.selectCustomerOrderByUserIdAndMerchantUid(userId, merchantUid);
    }

    public void updateTime(Order order) {
        orderMapper.updateEstimatedTime(order.getEstimatedTime(), order.getMerchantUid());
    }
}
