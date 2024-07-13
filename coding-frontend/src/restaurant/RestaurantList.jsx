import {Box, VStack, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export function RestaurantList({ restaurants, onRestaurantClick }) {
    const navigate = useNavigate();
    return (
        <VStack align="stretch" spacing={2} overflowY="auto" height="400px">
            {restaurants.map((restaurant, index) => (
                <Box
                    key={index}
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => onRestaurantClick(restaurant)}
                >
                    <Text fontWeight="bold" onClick={()=>navigate(`/menu/${restaurant.place.id}`)}>{restaurant.place.place_name}</Text>
                    <Text fontSize="sm">{restaurant.place.road_address_name || restaurant.place.address_name}</Text>
                </Box>
            ))}
        </VStack>
    );
}