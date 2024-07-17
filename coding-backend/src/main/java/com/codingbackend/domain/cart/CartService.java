package com.codingbackend.domain.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class CartService {

    private final CartMapper cartMapper;

    public List<Cart> getPaymentInfo(Integer userId, Long restaurantId) {
        return cartMapper.selectPaymentInfo(userId, restaurantId);
    }

    public void saveOrUpdate(Cart cart) {
        int count = cartMapper.selectByRestaurantIdAndMenuName(cart.getRestaurantId(), cart.getMenuName(), cart.getUserId());
        if (count == 0) {
            cartMapper.insert(cart);
        } else {
            cartMapper.deleteByRestaurantIdAndUserId(cart.getRestaurantId(), cart.getUserId());
            cartMapper.insert(cart);
        }
    }

    public List<Cart> getCartByUserIdAndRestaurantId(Integer userId, Long restaurantId) {
        return cartMapper.selectByUserIdAndRestaurantId(userId, restaurantId);
    }

    public List<Cart> getCartByUserId(Integer userId) {
        return cartMapper.selectByUserId(userId);
    }

    public void deleteByUserIdAndRestaurantIdAndMenuName(Integer userId, Long restaurantId, String menuName) {
        cartMapper.deleteByUserIdAndRestaurantIdAndMenuName(userId, restaurantId, menuName);
    }

    public void deleteByUserIdAndRestaurantId(Integer userId, Long restaurantId) {
        cartMapper.deleteByRestaurantIdAndUserId(restaurantId, userId);

    }
}
