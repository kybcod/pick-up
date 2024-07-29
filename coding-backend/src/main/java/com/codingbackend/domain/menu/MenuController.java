package com.codingbackend.domain.menu;

import com.codingbackend.domain.restaurant.RestaurantService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
//        menuService.insertMenu(menuRequest.getRestaurantId(), menuRequest.getMenuItems());
    }

    @PutMapping("/seller/{restaurantId}")
    public void updateMenu(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String restaurantName,
            @RequestParam(required = false) String restaurantTel,
            @RequestParam(required = false) MultipartFile logo,
            @RequestParam("menuItems") String menuItemsJson
    ) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<MenuItem> menuItems = objectMapper.readValue(menuItemsJson, new TypeReference<List<MenuItem>>() {
        });

        MenuRestaurant menuRestaurant = new MenuRestaurant();
        menuRestaurant.setRestaurantId(restaurantId);
        menuRestaurant.setRestaurantName(restaurantName);
        menuRestaurant.setRestaurantTel(restaurantTel);
        menuRestaurant.setLogo(logo);
        menuRestaurant.setMenuItems(menuItems);

        restaurantService.updateRestaurant(restaurantId, menuRestaurant);
        menuService.updateMenu(restaurantId, menuRestaurant);
    }


}
