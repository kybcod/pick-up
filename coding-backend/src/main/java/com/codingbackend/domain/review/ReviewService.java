package com.codingbackend.domain.review;

import com.codingbackend.domain.order.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.IOException;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewMapper reviewMapper;
    private final S3Client s3Client;
    private final OrderMapper orderMapper;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void insertReview(Review review, MultipartFile[] files) throws IOException {
        reviewMapper.insert(review);

        if (files != null) {
            for (MultipartFile file : files) {
                // DB 저장
                reviewMapper.insertFile(review.getId(), file.getOriginalFilename());

                //review_status True로 변경
                orderMapper.updateReviewStatus(review.getUserId(), review.getRestaurantId());

                //실제 S2 파일 저장
//                String key = STR."prj4/review/\{review.getId()}/\{file.getOriginalFilename()}";
//                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                        .bucket(bucketName)
//                        .key(key)
//                        .acl(ObjectCannedACL.PUBLIC_READ)
//                        .build();
//                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }
}
