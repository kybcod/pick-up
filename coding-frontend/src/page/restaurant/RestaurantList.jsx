import {
  Badge,
  Box,
  Flex,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function RestaurantList({ restaurants, onRestaurantClick }) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const [reviewInfo, setReviewInfo] = useState({});

  useEffect(() => {
    restaurants.map((restaurant) => {
      axios
        .get(`/api/menus/${restaurant.place.id}`)
        .then((res) => {
          setReviewInfo((prev) => ({
            ...prev,
            [restaurant.place.id]: res.data,
          }));
        })
        .catch(() => alert("리뷰 정보를 가져오는 데 실패했습니다."));
    });
  }, [restaurants]);

  return (
    <VStack spacing={0} align="stretch" height="100%" overflowY="auto">
      {restaurants.length === 0 ? (
        <Flex direction="column" align="center" justify="center" height="500px">
          <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4} />
          <Text fontSize="2xl" textAlign="center" color="gray.500">
            근처에 주문할 수 있는 가게가 없어요.
          </Text>
        </Flex>
      ) : (
        <>
          {restaurants.map((restaurant, index) => {
            const feedback = reviewInfo[restaurant.place.id];
            const { scoresum, scorecnt } = feedback || {
              scoresum: 0,
              scorecnt: 0,
            };
            const averageScore =
              scorecnt > 0 ? (scoresum / scorecnt).toFixed(1) : "리뷰 없음";

            return (
              <Box
                key={restaurant.place.id || index}
                p={4}
                bg={bgColor}
                borderBottomWidth="1px"
                borderColor="gray.200"
                cursor="pointer"
                onClick={() => {
                  onRestaurantClick(restaurant);
                  navigate(`/menu/${restaurant.place.id}`);
                }}
                _hover={{ bg: hoverColor }}
              >
                <Flex>
                  <Image
                    borderRadius="md"
                    boxSize="80px"
                    src={
                      restaurant.imageUrl || "https://via.placeholder.com/80"
                    }
                    alt={restaurant.place.place_name}
                    mr={4}
                  />
                  <Box>
                    <Flex align="center" mb={1}>
                      <Text fontWeight="bold" fontSize="lg">
                        {restaurant.place.place_name}
                      </Text>
                      <Badge ml={2} colorScheme="green">
                        픽업가능
                      </Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      {restaurant.place.road_address_name
                        ? `${restaurant.place.road_address_name} ${restaurant.place.address_name || ""}`
                        : restaurant.place.address_name}
                    </Text>
                    <Flex align="center">
                      <FontAwesomeIcon
                        icon={faStar}
                        style={{ color: "#FFD43B" }}
                      />
                      <Text ml={1} fontSize="sm" fontWeight="bold">
                        {averageScore}
                      </Text>
                      <Text ml={1} fontSize="sm" color="gray.500">
                        ({scorecnt > 0 ? `${scorecnt}+` : "No reviews"})
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </>
      )}
    </VStack>
  );
}
