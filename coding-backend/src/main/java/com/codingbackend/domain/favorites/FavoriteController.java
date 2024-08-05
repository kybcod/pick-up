package com.codingbackend.domain.favorites;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public void save(@RequestBody Favorite favorite) {
        favoriteService.update(favorite);
    }

    @Description("찜 리스트")
    @GetMapping("/{userId}")
    public List<Favorite> findAll(@PathVariable Integer userId) {
        return favoriteService.selectFavoriteListByUserId(userId);
    }

    @Description("찜 가져오기")
    @GetMapping("/{placeId}/{userId}")
    public List<Favorite> findRestaurant(@PathVariable("placeId") Long restaurantId, @PathVariable Integer userId) {
        return favoriteService.selectFavoriteList(restaurantId, userId);
    }
}
