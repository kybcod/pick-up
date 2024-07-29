import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Flex,
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
  }, []);

  if (sellerRestaurants === null) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  }

  function handleMenuDetails(restaurantId) {
    navigate(`/seller/${restaurantId}/menus`);
  }

  return (
    <Box p={5} bg="gray.50">
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {sellerRestaurants.map((restaurant, index) => (
          <Box
            onClick={() => handleMenuDetails(restaurant.restaurantId)}
            key={index}
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
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
                <Badge colorScheme="green">영업중</Badge>
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
