package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping
    public void insert(@RequestBody Restaurant restaurant) {
        restaurantService.insertRestaurants(restaurant);
    }

    @GetMapping("/{category}")
    public Category test(@PathVariable Integer category) {
        return restaurantService.getcategory(category);
    }
}
