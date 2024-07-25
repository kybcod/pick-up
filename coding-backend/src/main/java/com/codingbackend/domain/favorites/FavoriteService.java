package com.codingbackend.domain.favorites;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteMapper favoriteMapper;

    public void update(Favorite favorite) {
        if (favoriteMapper.selectByRestaurantId(favorite.getRestaurantId()) == 1) {
            favoriteMapper.delete(favorite.getRestaurantId());
        }
        favoriteMapper.insert(favorite);
    }
}
