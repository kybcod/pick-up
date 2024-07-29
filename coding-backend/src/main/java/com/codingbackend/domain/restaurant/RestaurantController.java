package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping
    public void insert(RestaurantRequestDto restaurant, @RequestParam(required = false) MultipartFile file) throws IOException {
        restaurantService.insertRestaurantInfo(restaurant, file);
    }

    @GetMapping
    public List<RestaurantRequestDto> getRestaurantInfo() {
        return restaurantService.getAll();
    }

    @GetMapping("seller/{userId}")
    public List<Restaurant> getRestaurantInfo(@PathVariable Integer userId) {
        return restaurantService.getRestaurantsByUserId(userId);
    }

    @GetMapping("{category}")
    public Category test(@PathVariable Integer category) {
        return restaurantService.getcategory(category);
    }
}
