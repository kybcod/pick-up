package com.codingbackend.domain.review;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public void insertReview(@ModelAttribute Review review, @RequestParam("files") MultipartFile[] files) throws IOException {
        reviewService.insertReview(review, files);
    }

    @GetMapping("{userId}")
    public List<Review> getAllReviews(@PathVariable Integer userId) {
        return reviewService.getAllReviews(userId);
    }
}
