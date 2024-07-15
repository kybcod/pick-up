package com.codingbackend.domain.restaurant;

import com.codingbackend.domain.menu.PlaceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping
    public void insert(@RequestBody Restaurant restaurant) {
        restaurantService.insertRestaurants(restaurant);
    }
}
