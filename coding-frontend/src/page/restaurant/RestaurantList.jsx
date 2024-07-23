import { Box, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function RestaurantList({
  restaurants,
  onRestaurantClick,
  restaurantsDb,
}) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const hoverColor = useColorModeValue("gray.200", "gray.600");

  const transformedRestaurantsDb = restaurantsDb.map((restaurant) => ({
    position: { lat: restaurant.latitude, lng: restaurant.longitude },
    content: restaurant.restaurantName,
    place: {
      id: restaurant.restaurantId,
      place_name: restaurant.restaurantName,
      address_name: restaurant.address,
      road_address_name: null,
      phone: restaurant.restaurantTel,
    },
    imageUrl: restaurant.logo,
  }));

  const combinedRestaurants = [
    ...restaurants,
    ...transformedRestaurantsDb,
  ].filter(
    (restaurant, index, self) =>
      index === self.findIndex((r) => r.place.id === restaurant.place.id),
  );

  return (
    <VStack spacing={2} align="stretch">
      {combinedRestaurants.map(
        (restaurant, index) =>
          restaurant &&
          restaurant.place && (
            <Box
              key={restaurant.place.id || index}
              p={3}
              bg={bgColor}
              borderRadius="md"
              cursor="pointer"
              onClick={() => {
                onRestaurantClick(restaurant);
                navigate(`/menu/${restaurant.place.id}`);
              }}
              _hover={{ bg: hoverColor }}
            >
              <Text fontWeight="bold">{restaurant.place.place_name}</Text>
              <Text fontSize="sm">
                {restaurant.place.road_address_name ||
                  restaurant.place.address_name}
              </Text>
            </Box>
          ),
      )}
    </VStack>
  );
}
