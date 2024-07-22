package com.codingbackend.domain.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;

    public PlaceDto getMenu(Integer placeId) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlaceDto> responseEntity = restTemplate.getForEntity("https://place.map.kakao.com/main/v/{placeId}", PlaceDto.class, placeId);
        return responseEntity.getBody();
    }

    public void insertMenu(Long restaurantId, List<MenuItem> menuItems) {
        menuItems.forEach(item -> {
            Menu menu = new Menu();
            menu.setRestaurantId(restaurantId);
            menu.setName(item.getName());
            menu.setPrice(item.getPrice());
            menu.setImg(item.getImg());
            menuMapper.insert(menu);
        });
    }
}