package com.codingbackend.domain.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewFileRequest {
    private Integer id;
    private Integer reviewId;
    private String fileName;
}
