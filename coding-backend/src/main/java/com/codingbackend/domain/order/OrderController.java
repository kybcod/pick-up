package com.codingbackend.domain.order;

import com.codingbackend.domain.cart.Cart;
import com.codingbackend.domain.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService;

    @GetMapping("{userId}/{restaurantId}")
    @Description("결제 => paymentStatus=False 일때")
    public List<Cart> getPayment(@PathVariable Integer userId, @PathVariable Long restaurantId) {
        return cartService.getCartByUserIdAndRestaurantId(userId, restaurantId);
    }

    @PostMapping
    public void addPayment(@RequestBody Order order) {
        orderService.insert(order);
    }

    @GetMapping("{userId}")
    @Description("결제 내역 => paymentStatus=TRUE 일때")
    public List<Cart> getPaymentList(@PathVariable Integer userId) {
        return cartService.getOrdersByUserId(userId);
    }

}
