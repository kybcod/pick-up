import React, {useContext, useEffect, useState} from 'react';
import {Box, Flex, HStack, Image, Text, VStack} from "@chakra-ui/react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";

function ReviewList(props) {
    const [reviewList, setReviewList] = useState([]);
    const account = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/reviews/${account.id}`)
            .then((res) => {
                console.log(res.data);
                setReviewList(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account.id]);

    const renderStars = (rating) => {
        return (
            <HStack>
                {[...Array(5)].map((_, i) => (
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

    return (
        <Box p={4}>
            {reviewList.length > 0 ? (
                reviewList.map((review) => (
                    <Box key={review.id} p={4} mb={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
                        <VStack align="start" spacing={3}>
                            <Text fontSize="lg" fontWeight="bold" cursor={"pointer"}
                                  onClick={() => navigate(`/menu/${review.restaurantId}`)}>식당
                                ID: {review.restaurantId}</Text>
                            <Text>{review.content}</Text>
                            <Text fontSize="sm" color="gray.500">작성일
                                : {new Date(review.inserted).toLocaleString()}</Text>
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
