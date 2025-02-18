package com.codingbackend.domain.review;

import com.codingbackend.domain.order.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;

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

                //실제 S3 파일 저장
                String key = STR."prj4/review/\{review.getId()}/\{file.getOriginalFilename()}";
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }

    public List<Review> getAllReviews(Integer userId) {
        List<Review> reviews = reviewMapper.selectAllReviews(userId);
        for (Review review : reviews) {
            List<String> fileNames = reviewMapper.selectFileNamesByReviewId(review.getId());
            List<ReviewFile> files = fileNames.stream()
                    .map(name -> new ReviewFile(name, STR."\{srcPrefix}review/\{review.getId()}/\{name}"))
                    .toList();
            review.setFileList(files);
        }
        return reviews;
    }

    public List<ReviewRequest> getSellerAllReviews(Integer userId, Long restaurantId) {
        List<ReviewRequest> reviews = reviewMapper.selectSellerAllReviews(userId, restaurantId);

        for (ReviewRequest review : reviews) {
            String logoPath = STR."\{srcPrefix}restaurant/\{restaurantId}/\{review.getLogo()}";
            review.setLogo(logoPath);

            List<String> fileNames = reviewMapper.selectFileNamesByReviewId(review.getId());
            List<ReviewFile> files = fileNames.stream()
                    .map(name -> new ReviewFile(name, STR."\{srcPrefix}review/\{review.getId()}/\{name}"))
                    .toList();
            review.setFileList(files);
        }
        return reviews;
    }
}
