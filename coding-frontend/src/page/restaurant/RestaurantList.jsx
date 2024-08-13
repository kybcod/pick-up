import React, { useEffect, useState } from "react";
import {
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
import axios from "axios";

export function RestaurantList({ restaurants, onRestaurantClick }) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const updatedRestaurants = await Promise.all(
        restaurants.map(async (restaurant) => {
          const { data } = await axios.get(`/api/menus/${restaurant.place.id}`);
          return { ...restaurant, ...data };
        }),
      );
      setRestaurantData(updatedRestaurants);
    };

    fetchMenus();
  }, [restaurants]);

  return (
    <VStack spacing={0} align="stretch" height="100%" overflowY="auto">
      {restaurantData.length === 0 ? (
        <Flex direction="column" align="center" justify="center" height="500px">
          <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4} />
          <Text fontSize="2xl" textAlign="center" color="gray.500">
            근처에 주문할 수 있는 가게가 없어요.
          </Text>
        </Flex>
      ) : (
        restaurantData.map((restaurant, index) => {
          const { scoresum, scorecnt } = restaurant.basicInfo.feedback;
          const averageScore =
            scorecnt > 0 ? (scoresum / scorecnt).toFixed(1) : 0;
          const {
            placenamefull,
            mainphotourl,
            road_address_name,
            address_name,
          } = restaurant.basicInfo;
          const imageUrl = mainphotourl || restaurant.imageUrl;

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
                  src={imageUrl}
                  alt={placenamefull || restaurant.place.place_name}
                  mr={4}
                />
                <Box>
                  <Flex align="center" mb={1}>
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                    >
                      {placenamefull || restaurant.place.place_name}
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    {road_address_name || restaurant.place.road_address_name
                      ? `${road_address_name || restaurant.place.road_address_name} ${address_name || restaurant.place.address_name || ""}`
                      : address_name || restaurant.place.address_name}
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
                      ({scorecnt > 0 ? `${scorecnt}+` : "0+"})
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          );
        })
      )}
    </VStack>
  );
}
