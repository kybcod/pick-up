package com.codingbackend.domain.seller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller")
public class SellerController {
    private final SellerService sellerService;

    @GetMapping("/orders/{userId}")
    public List<ReceivedOrder> getReceivedOrders(@PathVariable Integer userId) {
        return sellerService.get(userId);
    }
}
