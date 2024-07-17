package com.codingbackend.domain.payment;

import com.codingbackend.domain.cart.Cart;
import com.codingbackend.domain.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final CartService cartService;

    @GetMapping("{userId}/{restaurantId}")
    public List<Cart> getPayment(@PathVariable Integer userId, @PathVariable Long restaurantId) {
        return cartService.getPaymentInfo(userId, restaurantId);
    }

    @PostMapping
    public List<Payment> addPayment(@RequestBody Payment payment) {
        return paymentService.insertPaymentInfo(payment);
    }
}
