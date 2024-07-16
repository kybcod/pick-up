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
        int count = cartMapper.selectByRestaurantIdAndMenuName(cart.getRestaurantId(), cart.getMenuName(), cart.getUserId());
        if (count == 0) {
            cartMapper.insert(cart);
        } else {
            if (cart.getMenuCount() == 0) {
                cartMapper.deleteByRestaurantIdAndMenuName(cart.getRestaurantId(), cart.getMenuName(), cart.getUserId());
            } else {
                cartMapper.update(cart);
            }
        }
    }

    public List<Cart> getCartByUserIdAndRestaurantId(Integer userId, Long restaurantId) {
        return cartMapper.selectByUserIdAndRestaurantId(userId, restaurantId);
    }
}
