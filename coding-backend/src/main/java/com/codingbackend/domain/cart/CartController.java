package com.codingbackend.domain.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
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

    @GetMapping("{userId}")
    public List<Cart> getCartByUserId(@PathVariable Integer userId) {
        return cartService.getCartByUserId(userId);
    }

    @DeleteMapping("{userId}/{placeId}/{menuName}")
    public void delete(@PathVariable Integer userId, @PathVariable("placeId") Long restaurantId, @PathVariable String menuName) {
        cartService.deleteByUserIdAndRestaurantIdAndMenuName(userId, restaurantId, menuName);
    }

    @DeleteMapping("{userId}/{placeId}")
    public void delete(@PathVariable Integer userId, @PathVariable("placeId") Long restaurantId) {
        cartService.deleteByUserIdAndRestaurantId(userId, restaurantId);
    }
}
