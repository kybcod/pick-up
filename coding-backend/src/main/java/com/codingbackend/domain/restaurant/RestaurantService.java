package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

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

        //s3 저장
        if (file != null) {
            String key = STR."prj4/restaurant/\{restaurant.getRestaurantId()}/\{file.getOriginalFilename()}";
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            restaurant.setLogo(file.getOriginalFilename());
            restaurantMapper.updateLogo(restaurant);
        }
        System.out.println("restaurant = " + restaurant);
    }

    public Category getcategory(Integer category) {
        return restaurantMapper.select(category);
    }
}