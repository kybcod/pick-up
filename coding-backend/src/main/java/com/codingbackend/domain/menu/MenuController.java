package com.codingbackend.domain.menu;

import com.codingbackend.domain.restaurant.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
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
        menuService.insertMenu(menuRequest.getRestaurantId(), menuRequest.getMenuItems());
    }

    @DeleteMapping("{restaurantId}")
    public void deleteMenu(@PathVariable Long restaurantId) throws IOException {
        menuService.delete(restaurantId);
    }

    @PutMapping("/seller")
    public void updateMenu(MenuRequest menu,
                           @RequestParam(value = "removeFileList[]", required = false) List<String> removeFileList,
                           @RequestParam(value = "newFileList[]", required = false) MultipartFile[] newFileList) throws IOException {
        System.out.println("Remove File List: " + removeFileList);
        System.out.println("New File List: " + Arrays.toString(newFileList));
        menuService.updateMenu(menu.getRestaurantId(), menu.getMenuItems(), removeFileList, newFileList);
    }


}
