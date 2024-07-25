package com.codingbackend.domain.menu;

import com.codingbackend.domain.restaurant.Restaurant;
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
import java.util.stream.Collectors;

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

    public void updateMenu(MenuRestaurant menuRestaurant) throws IOException {
        Long restaurantId = menuRestaurant.getRestaurantId();

        for (MenuItem item : menuRestaurant.getMenuItems()) {
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

            menuMapper.update(menu);
        }
    }
}