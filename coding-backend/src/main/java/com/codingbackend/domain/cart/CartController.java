package com.codingbackend.domain.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Description("장바구니 유무에 따른 insert,delete")
    @PutMapping
    public void saveOrUpdateMenu(@RequestBody List<Cart> cartList) {
        for (Cart cart : cartList) {
            cartService.saveOrUpdate(cart);
        }
    }

    @Description("장바구니에서 한 유저가 선택한 가게")
    @GetMapping("{userId}/{placeId}")
    public List<Cart> getCartByUserIdAndRestaurantId(@PathVariable Integer userId, @PathVariable("placeId") Long restaurantId) {
        return cartService.getCartByUserIdAndRestaurantId(userId, restaurantId);
    }

    @Description("회원의 장바구니 내역 조회")
    @GetMapping("{userId}")
    public List<Cart> getCartByUserId(@PathVariable Integer userId) {
        return cartService.getCartByUserId(userId);
    }

    @Description("장바구니에서 삭제")
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("{userId}/{placeId}")
    public void delete(@PathVariable Integer userId, @PathVariable("placeId") Long restaurantId, Authentication authentication) {
        cartService.deleteByUserIdAndRestaurantId(userId, restaurantId);
    }
}
