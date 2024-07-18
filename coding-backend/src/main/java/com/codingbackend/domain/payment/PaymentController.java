package com.codingbackend.domain.payment;

import com.codingbackend.domain.cart.Cart;
import com.codingbackend.domain.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final CartService cartService;

    @GetMapping("{userId}/{restaurantId}")
    @Description("결제 => paymentStatus=False 일때")
    public List<Cart> getPayment(@PathVariable Integer userId, @PathVariable Long restaurantId) {
        return cartService.getCartByUserIdAndRestaurantId(userId, restaurantId);
    }

    @PostMapping
    public void addPayment(@RequestBody Payment payment) {
        paymentService.insert(payment);
    }

    @PutMapping
    public void updatePayment(@RequestBody Payment payment) {
        cartService.updatePaymentStatus(payment.getUserId(), payment.getRestaurantId());
    }

    @GetMapping("orders/{userId}")
    @Description("결제 내역 => paymentStatus=TRUE 일때")
    public List<Cart> getPaymentList(@PathVariable Integer userId) {
        return cartService.getOrdersByUserId(userId);
    }

}
