package com.codingbackend.domain.menu;

import com.codingbackend.domain.cart.CartMapper;
import com.codingbackend.domain.favorites.FavoriteMapper;
import com.codingbackend.domain.order.OrderMapper;
import com.codingbackend.domain.restaurant.Category;
import com.codingbackend.domain.restaurant.Restaurant;
import com.codingbackend.domain.restaurant.RestaurantMapper;
import com.codingbackend.domain.review.Review;
import com.codingbackend.domain.review.ReviewFile;
import com.codingbackend.domain.review.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;
    private final S3Client s3Client;
    private final RestaurantMapper restaurantMapper;
    private final ReviewMapper reviewMapper;
    private final CartMapper cartMapper;
    private final OrderMapper orderMapper;
    private final FavoriteMapper favoriteMapper;

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

            Category category = restaurantMapper.selectCategory(restaurant.getCategoryId());
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setCatename(category.getName());
            categoryDto.setCate1name(category.getGroupCode());
            if ("FD6".equals(category.getGroupCode())) {
                categoryDto.setCate1name("음식점");
            } else {
                categoryDto.setCate1name("카페");
            }
            basicInfo.setCategory(categoryDto);

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

    public void updateMenu(Long restaurantId, List<MenuItem> menuItems) throws IOException {

        //기존 매뉴 항목 조회
        List<Menu> existingMenus = menuMapper.selectMenu(Math.toIntExact(restaurantId));

        //기존 메뉴 삭제(s3, db)
        for (Menu existingMenu : existingMenus) {
            String key = STR."prj4/restaurant/\{existingMenu.getRestaurantId()}/\{existingMenu.getImg()}";
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .key(key)
                    .bucket(bucketName)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        }
        menuMapper.deleteMenu(restaurantId);

        // new 메뉴 추가
        insertMenu(restaurantId, menuItems);

    }


    public void delete(Long restaurantId) {
        // 메뉴 사진 삭제
        List<Menu> menuList = menuMapper.selectMenuList(restaurantId);
        for (Menu menu : menuList) {
            String key = STR."prj4/restaurant/\{restaurantId}/\{menu.getImg()}";
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        }
        // 메뉴 삭제
        menuMapper.deleteMenu(restaurantId);

        // 리뷰와 리뷰 사진 삭제
        List<Review> reviews = reviewMapper.selectByRestaurantId(restaurantId); // 리뷰가 여러 개일 수 있으므로 List로 수정
        for (Review review : reviews) {
            List<ReviewFile> reviewFiles = reviewMapper.selectReviewFile(review.getId());
            for (ReviewFile reviewFile : reviewFiles) {
                String key = STR."prj4/review/\{review.getId()}/\{reviewFile.getName()}";
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(deleteObjectRequest);
            }
            // 리뷰 삭제
            reviewMapper.deleteReview(review.getId());
        }

        // 장바구니 삭제
        cartMapper.deleteCart(restaurantId);
        // 주문 내역 삭제
        orderMapper.deleteOrder(restaurantId);
        // 찜 삭제
        favoriteMapper.deleteFavorite(restaurantId);

        // 가게 사진 삭제
        Restaurant restaurant = restaurantMapper.selectByRestaurantId(restaurantId);
        String key = STR."prj4/review/\{restaurantId}/\{restaurant.getLogo()}";
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(deleteObjectRequest);

        // 가게 삭제
        restaurantMapper.deleteRestaurant(restaurantId);
    }
}