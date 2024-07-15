package com.codingbackend.domain.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;

    public PlaceDto getMenu(Integer placeId) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<PlaceDto> responseEntity = restTemplate.getForEntity("https://place.map.kakao.com/main/v/{placeId}", PlaceDto.class, placeId);
        System.out.println("responseEntity = " + responseEntity);
        return responseEntity.getBody();
    }
}