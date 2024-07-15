package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;

    public void insertRestaurants(Restaurant restaurant) {
        //이미 저장되어 있다면 저장하지 않기
        if (restaurantMapper.selectIsRestaurantId(restaurant.getRestaurantId()) == 0) {
            restaurantMapper.insert(restaurant);
        }

    }
}