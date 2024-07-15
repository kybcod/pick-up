package com.codingbackend.domain.menu;

import com.codingbackend.domain.restaurant.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;
    private final RestaurantMapper restaurantMapper;

    public PlaceDto getMenu(Integer placeId) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlaceDto> responseEntity = restTemplate.getForEntity("https://place.map.kakao.com/main/v/{placeId}", PlaceDto.class, placeId);
        PlaceDto placeDto = responseEntity.getBody();

        if (placeDto != null && placeDto.getMenuInfo() != null) {
            String placeCategory = determineCategory(placeDto.getMenuInfo().getMenuList());
            placeDto.getBasicInfo().getCategory().setCate1name(placeCategory);
            System.out.println("placeCategory = " + placeCategory);

            restaurantMapper.updateCategory(placeId, placeCategory);
        }

        return placeDto;
    }

    private String determineCategory(List<MenuDto> menuList) {
        Map<String, String> categoryKeywords = CategoryKeywords.getCategoryKeywords();

        for (MenuDto menu : menuList) {
            for (Map.Entry<String, String> entry : categoryKeywords.entrySet()) {
                String category = entry.getKey();
                String keywords = entry.getValue();
                for (String keyword : keywords.split("\\|")) {
                    if (menu.getMenu().contains(keyword)) {
                        return category;
                    }
                }
            }
        }
        return "한식";  // 매칭되지 않을 경우 기본값 설정
    }
}

