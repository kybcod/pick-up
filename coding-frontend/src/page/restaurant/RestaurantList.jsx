import {Box, Text, useColorModeValue, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export function RestaurantList({restaurants, onRestaurantClick}) {
    const navigate = useNavigate();
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const hoverColor = useColorModeValue("gray.200", "gray.600");

    return (
        <VStack align="stretch" spacing={2} overflowY="auto" height="100%">
            {restaurants.map((restaurant, index) => (
                <Box
                    key={index}
                    p={4}
                    bg={bgColor}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{bg: hoverColor}}
                    onClick={() => onRestaurantClick(restaurant)}
                >
                    <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color="teal.600"
                        mb={1}
                        onClick={() => navigate(`/menu/${restaurant.place.id}`)}
                    >
                        {restaurant.place.place_name}
                    </Text>
                    <Text
                        fontSize="sm"
                        color="gray.600"
                        noOfLines={1}
                    >
                        {restaurant.place.road_address_name || restaurant.place.address_name}
                    </Text>
                </Box>
            ))}
        </VStack>
    );
}
