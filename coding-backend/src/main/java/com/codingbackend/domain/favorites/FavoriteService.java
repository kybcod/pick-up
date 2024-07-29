package com.codingbackend.domain.favorites;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteMapper favoriteMapper;

    public void update(Favorite favorite) {
        if (favoriteMapper.selectByRestaurantId(favorite.getRestaurantId(), favorite.getUserId()) == 1) {
            favoriteMapper.delete(favorite.getRestaurantId(), favorite.getUserId());
        } else {
            favoriteMapper.insert(favorite);

        }
    }

    public List<Favorite> selectFavoriteListByUserId(Integer userId) {
        return favoriteMapper.getAllByUserId(userId);
    }

    public List<Favorite> selectFavoriteList(Long restaurantId, Integer userId) {
        return favoriteMapper.getByRestaurantIdAndUserId(restaurantId, userId);
    }
}
