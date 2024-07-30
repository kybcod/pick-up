import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useParams } from "react-router-dom";

function SellerReviewList() {
  const account = useContext(LoginContext);
  const userId = account.id;
  const { restaurantId } = useParams();
  const [reviewList, setReviewList] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState({});

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    axios
      .get(`/api/reviews/seller/${userId}/${restaurantId}`)
      .then(async (res) => {
        const reviews = res.data;
        console.log("review", reviews);
        setReviewList(reviews);

        const restaurantIds = [
          ...new Set(reviews.map((review) => review.restaurantId)),
        ];
        const restaurantPromises = restaurantIds.map((id) =>
          axios.get(`/api/restaurants/${id}`).then((response) => ({
            id,
            data: response.data,
          })),
        );

        try {
          const restaurantResponses = await Promise.all(restaurantPromises);
          const info = {};
          restaurantResponses.forEach(({ id, data }) => {
            info[id] = data; // Store all restaurant details
          });
          setRestaurantInfo(info);
        } catch (error) {
          console.error("Failed to fetch restaurant details:", error);
        }
      });
  }, [userId]);

  const renderStars = (rating) => {
    return (
      <HStack spacing={1}>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <Box
            key={i}
            as="span"
            color={i < rating ? "#FFD43B" : "gray"}
            fontSize="sm"
          >
            ★
          </Box>
        ))}
      </HStack>
    );
  };

  return (
    <Box maxW="800px" margin="auto" p={5}>
      <Heading mb={6} textAlign="center">
        판매자 리뷰 내역
      </Heading>
      {reviewList.length > 0 ? (
        reviewList.map((review) => (
          <Box
            key={review.id}
            p={6}
            mb={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg={bgColor}
            borderColor={borderColor}
          >
            <HStack spacing={4} mb={4}>
              <Avatar
                size="md"
                name={review.restaurantName}
                src={review.logo || "https://bit.ly/broken-link"}
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  {review.restaurantName}
                </Text>
                <HStack>
                  {renderStars(review.rating)}
                  <Text fontSize="sm" color="gray.500">
                    {new Date(review.inserted).toLocaleString("ko-KR")}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            <Text mb={4}>{review.content}</Text>

            {review.fileList && review.fileList.length > 0 && (
              <Flex wrap="wrap" gap={2} mb={4}>
                {review.fileList.map((file, index) => (
                  <Image
                    key={index}
                    src={file.src}
                    alt={file.name}
                    boxSize="150px"
                    borderRadius="md"
                  />
                ))}
              </Flex>
            )}
          </Box>
        ))
      ) : (
        <Flex direction="column" align="center" justify="center" height="500px">
          <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4} />
          <Text fontSize="2xl" textAlign="center" color="gray.500">
            아직 작성된 리뷰가 없습니다.
          </Text>
          <Text fontSize="lg" textAlign="center" color="gray.400" mt={2}>
            고객의 소중한 리뷰를 기다리고 있습니다!
          </Text>
        </Flex>
      )}
    </Box>
  );
}

export default SellerReviewList;
