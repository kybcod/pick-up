package com.codingbackend.domain.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenuController {
    private final MenuService menuService;

    @Description("외부 API에서 메뉴 가져오기")
    @GetMapping("{placeId}")
    public PlaceDto getMenus(@PathVariable Integer placeId) throws IOException {
        return menuService.getPlaceInfo(placeId);
    }

    @GetMapping("/list/{restaurantId}")
    public List<Menu> getMenus(@PathVariable Long restaurantId) throws IOException {
        return menuService.getMenuList(restaurantId);
    }

    @Description("메뉴 등록")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity insertMenu(MenuRequest menuRequest) throws IOException {
        if (menuService.validate(menuRequest)) {
            menuService.insertMenu(menuRequest.getRestaurantId(), menuRequest.getMenuItems());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();

    }

    @Description("판매자 메뉴 삭제")
    @DeleteMapping("{restaurantId}")
    public void deleteMenu(@PathVariable Long restaurantId) throws IOException {
        menuService.delete(restaurantId);
    }


    @Description("메뉴 수정")
    @PutMapping("/seller")
    public void updateMenu(
            MenuRequest menu,
            @RequestParam(value = "removeFileList", required = false) List<String> removeFileList,
            @RequestPart(value = "newFileList", required = false) MultipartFile[] newFileList
    ) throws IOException {
        menuService.updateMenu(menu.getRestaurantId(), menu.getMenuItems(), removeFileList, newFileList);
    }


}
