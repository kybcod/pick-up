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

}
