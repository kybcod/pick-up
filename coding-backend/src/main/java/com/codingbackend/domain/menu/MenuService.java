package com.codingbackend.domain.menu;

import com.codingbackend.domain.restaurant.Restaurant;
import com.codingbackend.domain.restaurant.RestaurantMapper;
import com.codingbackend.domain.review.Review;
import com.codingbackend.domain.review.ReviewMapper;
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
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;
    private final S3Client s3Client;
    private final RestaurantMapper restaurantMapper;
    private final ReviewMapper reviewMapper;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public PlaceDto getPlaceInfo(Integer placeId) {
        //외부 API
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlaceDto> responseEntity = restTemplate.getForEntity("https://place.map.kakao.com/main/v/{placeId}", PlaceDto.class, placeId);
        PlaceDto placeDto = responseEntity.getBody();

        if (placeDto != null && Boolean.TRUE.equals(placeDto.getIsExist())) {
            return placeDto;
        } else {
            // 내부 DB : 메뉴 정보 받아오기
            List<Menu> menuList = menuMapper.selectMenu(placeId);
            List<MenuDto> menuDtoList = menuList.stream()
                    .map((menu -> {
                        MenuDto menuDto = new MenuDto();
                        menuDto.setMenu(menu.getName());
                        menuDto.setPrice(menu.getPrice());
                        menuDto.setImg(s3Img(menu.getImg(), placeId));
                        return menuDto;
                    })).collect(Collectors.toList());

            // 3. PlaceDto의 MenuInfoDto 설정
            MenuInfoDto menuInfoDto = new MenuInfoDto(menuDtoList.size(), menuDtoList);

            // PlaceDto의 MenuInfoDto 설정
            placeDto.setMenuInfo(menuInfoDto);

            // basicInfo : 가게명, 가게사진, 가게 전화번호
            Restaurant restaurant = restaurantMapper.selectByRestaurantId(Long.valueOf(placeId));
            BasicInfo basicInfo = new BasicInfo();
            basicInfo.setPlacenamefull(restaurant.getRestaurantName());
            basicInfo.setMainphotourl(STR."\{srcPrefix}restaurant/\{placeId}/\{restaurant.getLogo()}");
            basicInfo.setPhonenum(restaurant.getRestaurantTel());

            // 리뷰 정보 설정
            Review restaurantReview = reviewMapper.selectReviewByRestaurantId(Long.valueOf(placeId));
            FeedbackDto feedbackDto = new FeedbackDto();
            feedbackDto.setScoresum(restaurantReview.getReviewSum()); // 적절한 메서드로 수정
            feedbackDto.setScorecnt(restaurantReview.getReviewCount());  // 적절한 메서드로 수정
            basicInfo.setFeedback(feedbackDto);


            placeDto.setBasicInfo(basicInfo);

            return placeDto;
        }

    }

    private String s3Img(String img, Integer placeId) {
        if (img == null || img.trim().isEmpty()) {
            return "";
        }
        return STR."\{srcPrefix}restaurant/\{placeId}/\{img}";
    }

//    public void insertMenu(Long restaurantId, List<MenuItem> menuItems) throws IOException {
//        for (MenuItem item : menuItems) {
//            Menu menu = new Menu();
//            menu.setRestaurantId(restaurantId);
//            menu.setName(item.getName());
//            menu.setPrice(item.getPrice());
//
//            if (item.getImg() != null && !item.getImg().isEmpty()) {
//                String key = STR."prj4/restaurant/\{restaurantId}/\{item.getImg().getOriginalFilename()}";
//                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                        .bucket(bucketName)
//                        .key(key)
//                        .acl(ObjectCannedACL.PUBLIC_READ)
//                        .build();
//
//                s3Client.putObject(putObjectRequest,
//                        RequestBody.fromInputStream(item.getImg().getInputStream(), item.getImg().getSize()));
//
//                menu.setImg(item.getImg().getOriginalFilename());
//            }
//
//            menuMapper.insert(menu);
//        }
//    }

    public void updateMenu(Long restaurantId, MenuRestaurant menuRestaurant) throws IOException {
        for (MenuItem item : menuRestaurant.getMenuItems()) {
            Menu menu = new Menu();
            menu.setRestaurantId(restaurantId);
            menu.setName(item.getName());
            menu.setPrice(item.getPrice());

            if (item.getImg() != null && item.getImg().getDataUrl() != null) {
                if (item.getImg().getDataUrl().startsWith("data:image")) {
                    // Base64 인코딩된 이미지 데이터에서 실제 이미지 데이터 추출
                    String base64Image = item.getImg().getDataUrl().split(",")[1];
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);

                    String fileName = item.getImg().getFileName() != null ? item.getImg().getFileName() : "menu_" + UUID.randomUUID().toString() + ".jpg";
                    String key = "prj4/restaurant/" + restaurantId + "/menu/" + fileName;

                    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .acl(ObjectCannedACL.PUBLIC_READ)
                            .build();

                    s3Client.putObject(putObjectRequest,
                            RequestBody.fromBytes(imageBytes));

                    // S3에 업로드된 이미지의 URL을 저장
                    menu.setImg("https://" + bucketName + ".s3.amazonaws.com/" + key);
                } else {
                    // 기존 이미지 URL을 그대로 사용
                    menu.setImg(item.getImg().getDataUrl());
                }
            }

            menuMapper.update(menu);
        }
    }
}