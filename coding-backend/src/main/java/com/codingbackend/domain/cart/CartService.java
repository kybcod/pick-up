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

    public void saveOrUpdate(Cart cart) {
        int count = cartMapper.selectByRestaurantIdAndMenuNameAndUserIdAndPaymentStatusFalse(cart.getRestaurantId(), cart.getMenuName(), cart.getUserId());
        if (count == 0) {
            cartMapper.insert(cart);
        } else {
            cartMapper.deleteByRestaurantIdAndUserId(cart.getRestaurantId(), cart.getUserId());
            cartMapper.insert(cart);
        }
    }

    public List<Cart> getCartByUserIdAndRestaurantId(Integer userId, Long restaurantId) {
        return cartMapper.selectByUserIdAndRestaurantIdAndPaymentStatus(userId, restaurantId);
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

    public void updatePaymentStatus(Integer userId, Long restaurantId) {
        cartMapper.updateByUserIdAndRestaurantId(userId, restaurantId);
    }

    public List<Cart> getOrdersByUserId(Integer userId) {
        return cartMapper.selectByUserIdAndPaymentStatusTrue(userId);
    }
}
