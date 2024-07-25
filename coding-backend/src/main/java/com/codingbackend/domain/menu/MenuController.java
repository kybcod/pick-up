package com.codingbackend.domain.menu;

import com.codingbackend.domain.restaurant.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenuController {
    private final MenuService menuService;
    private final RestaurantService restaurantService;

    @GetMapping("{placeId}")
    public PlaceDto getMenus(@PathVariable Integer placeId) throws IOException {
        return menuService.getPlaceInfo(placeId);
    }

    @PostMapping
    public void insertMenu(MenuRequest menuRequest) throws IOException {
        menuService.insertMenu(menuRequest.getRestaurantId(), menuRequest.getMenuItems());
    }

    @PutMapping
    public void updateMenu(@RequestBody MenuRestaurant menuRestaurant) throws IOException {
        restaurantService.updateRestaurant(menuRestaurant);
        menuService.updateMenu(menuRestaurant);
    }
}
