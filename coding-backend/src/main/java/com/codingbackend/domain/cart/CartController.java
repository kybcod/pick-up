package com.codingbackend.domain.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PutMapping
    public void saveOrUpdateMenu(@RequestBody List<Cart> cartList) {
        for (Cart cart : cartList) {
            cartService.saveOrUpdate(cart);
        }
    }

    @GetMapping("{userId}/{placeId}")
    public List<Cart> getCartByUserIdAndRestaurantId(@PathVariable Integer userId, @PathVariable("placeId") Long restaurantId) {
        return cartService.getCartByUserIdAndRestaurantId(userId, restaurantId);
    }
}
