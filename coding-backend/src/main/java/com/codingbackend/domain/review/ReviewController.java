package com.codingbackend.domain.review;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public void insertReview(@ModelAttribute Review review, @RequestParam("files") MultipartFile[] files) throws IOException {
        reviewService.insertReview(review, files);
    }
}
