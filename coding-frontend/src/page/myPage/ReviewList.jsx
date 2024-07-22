import React, {useContext, useEffect, useState} from 'react';
import {Box, Flex, HStack, Image, Spinner, Text, VStack} from "@chakra-ui/react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";

function ReviewList() {
    const [reviewList, setReviewList] = useState([]);
    const [restaurantInfo, setRestaurantInfo] = useState({});
    const account = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/reviews/${account.id}`)
            .then(async (res) => {
                console.log(res.data);
                const reviews = res.data;
                setReviewList(reviews);

                // 리뷰에서 식당 ID를 추출하여 식당 정보 가져오기
                const restaurantIds = [...new Set(reviews.map(review => review.restaurantId))];
                const restaurantPromises = restaurantIds.map(id =>
                    axios.get(`/api/menus/${id}`).then(response => ({
                        id,
                        data: response.data
                    }))
                );

                try {
                    const restaurantResponses = await Promise.all(restaurantPromises);
                    const info = {};
                    restaurantResponses.forEach(({id, data}) => {
                        info[id] = data.basicInfo; // 필요한 정보만 저장
                    });
                    setRestaurantInfo(info);
                } catch (error) {
                    console.error("식당 정보 조회 실패:", error);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account.id]);

    const renderStars = (rating) => {
        return (
            <HStack>
                {[1, 2, 3, 4, 5].map((_, i) => (
                    <FontAwesomeIcon
                        key={i}
                        icon={i < rating ? fullStar : emptyStar}
                        color={i < rating ? "yellow" : "gray"}
                        size="lg"
                    />
                ))}
            </HStack>
        );
    };

    if (reviewList.length === 0 || Object.keys(restaurantInfo).length === 0) {
        return <Spinner/>;
    }

    return (
        <Box p={4}>
            {reviewList.length > 0 ? (
                reviewList.map((review) => (
                    <Box key={review.id} p={4} mb={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
                        <VStack align="start" spacing={3}>
                            <Text fontSize="lg" fontWeight="bold" cursor="pointer"
                                  onClick={() => navigate(`/menu/${review.restaurantId}`)}>
                                {restaurantInfo[review.restaurantId]?.placenamefull || "식당 정보 없음"}
                            </Text>
                            <Text>{review.content}</Text>
                            <Text fontSize="sm" color="gray.500">
                                작성일: {new Date(review.inserted).toLocaleString()}
                            </Text>
                            {renderStars(review.rating)}
                            {review.fileList && review.fileList.length > 0 && (
                                <Flex wrap="wrap" gap={2}>
                                    {review.fileList.map((file, index) => (
                                        <Image
                                            key={index}
                                            src={file.src}
                                            alt={file.name}
                                            boxSize="100px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                    ))}
                                </Flex>
                            )}
                        </VStack>
                    </Box>
                ))
            ) : (
                <Text>No reviews found</Text>
            )}
        </Box>
    );
}

export default ReviewList;
