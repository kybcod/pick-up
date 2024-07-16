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

        // 해당 가게와 그 가게의 메뉴가 없을 때만 save
        if (cartMapper.selectByRestaurantIdAndMenuName(cart.getRestaurantId(), cart.getMenuName()) == 0) {
            cartMapper.insert(cart);
        } else {
            // 메뉴가 있을 때 update
            cartMapper.update(cart);
        }

        // 다시 조회 후 해당 메뉴가 없다면 삭제
        int count = cartMapper.selectByRestaurantIdAndMenuName(cart.getRestaurantId(), cart.getMenuName());
        if (count == 0) {
            cartMapper.deleteByRestaurantIdAndMenuName(cart.getRestaurantId(), cart.getMenuName());
        }
    }


    public List<Cart> selectAllCartList() {
        return cartMapper.selectAll();
    }
}
