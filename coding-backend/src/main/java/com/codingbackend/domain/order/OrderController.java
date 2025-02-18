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
    @Description("주문 내역")
    public List<Cart> getPaymentList(@PathVariable Integer userId) {
        return cartService.getOrdersByUserId(userId);
    }


    //판매자
    @Description("판매자 주문 확인 내역 ")
    @GetMapping("/seller/{userId}")
    public List<ReceivedOrder> getReceivedOrders(@PathVariable Integer userId) {
        return orderService.get(userId);
    }

    @GetMapping("buy/{userId}/{merchantUid}")
    public List<CustomerOrderResponse> getOrderList(@PathVariable Integer userId, @PathVariable String merchantUid) {
        return orderService.getCustomerOrderList(userId, merchantUid);
    }

    @PutMapping("time")
    public void updateTime(@RequestBody Order order) {
        orderService.updateTime(order);
    }

    @PutMapping("pick-up")
    public void updatePickUpStatus(@RequestBody Order order) {
        orderService.updatePickUpStatus(order);
    }

    @Description("주문 횟수")
    @GetMapping("/seller/{userId}/count")
    public OrderCount getCount(@PathVariable Integer userId) {
        return orderService.getCount(userId);
    }

}
