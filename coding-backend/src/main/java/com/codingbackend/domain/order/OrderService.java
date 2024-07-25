package com.codingbackend.domain.order;

import com.codingbackend.domain.cart.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class OrderService {
    private final OrderMapper orderMapper;
    private final CartMapper cartMapper;
    private S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

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

    public void updatePickUpStatus(Order order) {
        orderMapper.updatePickUpStatus(order.getMerchantUid());
    }

    public List<ReceivedOrder> get(Integer userId) {
        List<ReceivedOrder> receivedOrders = orderMapper.selectReceivedOrder(userId);
        return receivedOrders.stream().map(orders -> {
            String logoPath = STR."\{srcPrefix}restaurant/\{orders.getRestaurantId()}/\{orders.getLogo()}";
            orders.setLogo(logoPath);
            return orders;
        }).collect(Collectors.toList());
    }
}
