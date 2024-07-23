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

export function RestaurantList({ restaurants, onRestaurantClick }) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");

  return (
    <VStack spacing={0} align="stretch" height="100%" overflowY="auto">
      {restaurants.map((restaurant, index) => (
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
                {restaurant.place.road_address_name
                  ? `${restaurant.place.road_address_name} ${restaurant.place.address_name || ""}`
                  : restaurant.place.address_name}
              </Text>
              <Flex align="center">
                <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
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
      ))}
    </VStack>
  );
}
