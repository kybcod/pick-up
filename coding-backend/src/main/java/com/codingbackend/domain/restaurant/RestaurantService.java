package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void insertRestaurantInfo(RestaurantRequestDto restaurant, MultipartFile file) throws IOException {
        // 데이터베이스에 저장
        restaurantMapper.insert(restaurant);

        //카테고리 연결 시키기

        //s3 저장

    }

    public Category getcategory(Integer category) {
        return restaurantMapper.selectCategory(category);
    }

    public List<RestaurantRequestDto> getAll() {
        List<RestaurantRequestDto> restaurants = restaurantMapper.selectAll();
        return restaurants.stream().map(restaurant -> {
            String logoPath = STR."\{srcPrefix}restaurant/\{restaurant.getRestaurantId()}/\{restaurant.getLogo()}";
            restaurant.setLogo(logoPath);
            return restaurant;
        }).collect(Collectors.toList());
    }

}