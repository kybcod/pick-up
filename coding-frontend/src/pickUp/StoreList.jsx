// RestaurantList 컴포넌트
import {Box, VStack, Text} from "@chakra-ui/react";

export function StoreList({ store, onStoreClick }) {
    return (
        <VStack align="stretch" spacing={2} overflowY="auto" height="400px">
            {store.map((restaurant, index) => (
                <Box
                    key={index}
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => onStoreClick(restaurant)}
                >
                    <Text fontWeight="bold">{restaurant.place.place_name}</Text>
                    <Text fontSize="sm">{restaurant.place.road_address_name || restaurant.place.address_name}</Text>
                </Box>
            ))}
        </VStack>
    );
}