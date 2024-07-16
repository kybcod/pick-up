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
    public void saveOrUpdateMenu(@RequestBody Cart cart) {
        cartService.saveOrUpdate(cart);
    }

    @GetMapping
    public List<Cart> getAll() {
        return cartService.selectAllCartList();
    }
}
