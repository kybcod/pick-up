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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fullStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

function ReviewList() {
  const [reviewList, setReviewList] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    axios
      .get(`/api/reviews/${account.id}`)
      .then(async (res) => {
        console.log(res.data);
        const reviews = res.data;
        setReviewList(reviews);

        // 리뷰에서 식당 ID를 추출하여 식당 정보 가져오기
        const restaurantIds = [
          ...new Set(reviews.map((review) => review.restaurantId)),
        ];
        const restaurantPromises = restaurantIds.map((id) =>
          axios.get(`/api/menus/${id}`).then((response) => ({
            id,
            data: response.data,
          })),
        );

        try {
          const restaurantResponses = await Promise.all(restaurantPromises);
          const info = {};
          restaurantResponses.forEach(({ id, data }) => {
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
  }, []);

  const renderStars = (rating) => {
    return (
      <HStack spacing={1}>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={i < rating ? fullStar : emptyStar}
            color={i < rating ? "#FFD700" : "gray"}
            size="sm"
          />
        ))}
      </HStack>
    );
  };

  return (
    <Box maxW="800px" margin="auto" p={5}>
      <Heading mb={6} color="blue.500">
        나의 리뷰
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
                name={account.nickName}
                src={account.profileImage || "https://bit.ly/broken-link"}
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  {account.nickName}
                </Text>
                <HStack>
                  {renderStars(review.rating)}
                  <Text fontSize="sm" color="gray.500">
                    {new Date(review.inserted).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            <Text
              fontSize="xl"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => navigate(`/menu/${review.restaurantId}`)}
              color="blue.500"
              mb={2}
            >
              {restaurantInfo[review.restaurantId]?.placenamefull}
            </Text>

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
            아직 작성한 리뷰가 없어요.
          </Text>
          <Text fontSize="lg" textAlign="center" color="gray.400" mt={2}>
            맛있게 드신 음식점에 리뷰를 남겨보세요!
          </Text>
        </Flex>
      )}
    </Box>
  );
}

export default ReviewList;
