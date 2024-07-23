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

export function RestaurantList({
  restaurants,
  onRestaurantClick,
  restaurantsDb,
}) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");

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
    <VStack spacing={0} align="stretch" height="100%" overflowY="auto">
      {combinedRestaurants.map(
        (restaurant, index) =>
          restaurant &&
          restaurant.place && (
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
                  src={restaurant.imageUrl || "https://via.placeholder.com/80"}
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
                    {restaurant.place.road_address_name !== null
                      ? restaurant.place.road_address_name +
                        restaurant.place.address_name
                      : restaurant.place.address_name}
                  </Text>
                  <Flex align="center">
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: "#FFD43B" }}
                    />
                    <Text ml={1} fontSize="sm" fontWeight="bold">
                      4.5
                    </Text>
                    <Text ml={1} fontSize="sm" color="gray.500">
                      (350+)
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ),
      )}
    </VStack>
  );
}
