package com.codingbackend.domain.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenuController {
    private final MenuService menuService;

    @GetMapping("{placeId}")
    public PlaceDto getMenus(@PathVariable Integer placeId) throws IOException {
        return menuService.getMenu(placeId);
    }

    @PostMapping
    public void insertMenu(@RequestBody MenuRequest menuRequest) throws IOException {
        menuService.insertMenu(menuRequest.getRestaurantId(), menuRequest.getMenuItems());
    }
}
