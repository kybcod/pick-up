package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @Description("가게 등록")
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity insert(Restaurant restaurant, @RequestParam(required = false) MultipartFile file, Authentication authentication) throws IOException {
        if (restaurantService.validate(restaurant)) {
            restaurantService.insertRestaurantInfo(restaurant, file, authentication);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @Description("가게 조회")
    @GetMapping
    public List<RestaurantRequestDto> getRestaurantInfo() {
        return restaurantService.getAll();
    }

    @Description("하나의 가게 조회")
    @GetMapping("{restaurantId}")
    public ResponseEntity getRestaurant(@PathVariable Long restaurantId) {
        Restaurant restaurant = restaurantService.getByRestaurantId(restaurantId);
        if (restaurant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(restaurant);
    }

    @Description("판매자 가게 조회")
    @GetMapping("seller/{userId}")
    public List<Restaurant> getRestaurantInfo(@PathVariable Integer userId) {
        return restaurantService.getRestaurantsByUserId(userId);
    }

    @Description("카테고리 구분")
    @GetMapping("category/{category}")
    public Category test(@PathVariable Integer category) {
        return restaurantService.getcategory(category);
    }

    @Description("가게 수정")
    @PreAuthorize("isAuthenticated()")
    @PutMapping
    public ResponseEntity updateRestaurant(Restaurant restaurant, Authentication authentication, @RequestParam(required = false) MultipartFile file) throws IOException {
        //가게 주인이랑 로그인한 사람이 같지 않다면
        if (!restaurantService.hasAccess(restaurant.getRestaurantId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (restaurantService.validate(restaurant)) {
            restaurantService.updateRestaurant(restaurant, file);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}
