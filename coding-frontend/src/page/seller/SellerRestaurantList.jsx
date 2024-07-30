import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

function SellerRestaurantList(props) {
  const account = useContext(LoginContext);
  const userId = account.id;
  const [sellerRestaurants, setSellerRestaurants] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/restaurants/seller/${userId}`).then((res) => {
      console.log("store", res.data);
      setSellerRestaurants(res.data);
    });
  }, [userId]);

  if (sellerRestaurants === null) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  }

  function handleMenuDetails(restaurantId) {
    navigate(`/seller/${restaurantId}`);
  }

  function handleReviewView(e, restaurantId) {
    e.stopPropagation(); // Prevent triggering parent click event
    navigate(`/seller/${restaurantId}/reviews`);
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <Heading mb={8} textAlign="center">
        가게 관리
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {sellerRestaurants.map((restaurant, index) => (
          <Box
            key={index}
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
            position="relative" // For absolute positioning of the button
          >
            <Image
              src={restaurant.logo}
              alt={restaurant.restaurantName}
              height="200px"
              width="100%"
            />
            <Box p={4}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="xl" fontWeight="bold">
                  {restaurant.restaurantName}
                </Text>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={(e) => handleReviewView(e, restaurant.restaurantId)}
                  position="absolute"
                  bottom="10px"
                  right="10px"
                  variant={"outline"}
                >
                  리뷰 보기
                </Button>
              </Flex>
              <Text color="gray.600" fontSize="sm" mb={2}>
                {restaurant.address}
              </Text>
              <Text color="blue.600" fontSize="sm">
                {restaurant.restaurantTel}
              </Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default SellerRestaurantList;
