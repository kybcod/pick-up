package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenuController {
    private final MenuService menuService;

    @GetMapping("{placeId}")
    public List<Menu> getMenus(@PathVariable Integer placeId) throws IOException {
        System.out.println("placeId = " + placeId);
        return menuService.getMenuList(placeId);
    }
}
