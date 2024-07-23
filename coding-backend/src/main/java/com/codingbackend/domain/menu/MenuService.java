package com.codingbackend.domain.menu;

import com.codingbackend.domain.restaurant.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;
    private final S3Client s3Client;
    private final RestaurantMapper restaurantMapper;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public PlaceDto getMenu(Integer placeId) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlaceDto> responseEntity = restTemplate.getForEntity("https://place.map.kakao.com/main/v/{placeId}", PlaceDto.class, placeId);
        return responseEntity.getBody();
    }

    public void insertMenu(Long restaurantId, List<MenuItem> menuItems) throws IOException {
        for (MenuItem item : menuItems) {
            Menu menu = new Menu();
            menu.setRestaurantId(restaurantId);
            menu.setName(item.getName());
            menu.setPrice(item.getPrice());

            if (item.getImg() != null && !item.getImg().isEmpty()) {
                String key = STR."prj4/restaurant/\{restaurantId}/\{item.getImg().getOriginalFilename()}";
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(putObjectRequest,
                        RequestBody.fromInputStream(item.getImg().getInputStream(), item.getImg().getSize()));

                menu.setImg(item.getImg().getOriginalFilename());
            }

            menuMapper.insert(menu);
        }
    }
}