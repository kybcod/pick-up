package com.codingbackend.domain.seller;

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
public class SellerService {
    private final SellerMapper sellerMapper;
    private S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public List<ReceivedOrder> get(Integer userId) {
        List<ReceivedOrder> receivedOrders = sellerMapper.selectReceivedOrder(userId);
        return receivedOrders.stream().map(orders -> {
            String logoPath = STR."\{srcPrefix}restaurant/\{orders.getRestaurantId()}/\{orders.getLogo()}";
            orders.setLogo(logoPath);
            return orders;
        }).collect(Collectors.toList());
    }

}
