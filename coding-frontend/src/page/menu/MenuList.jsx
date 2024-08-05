import {Box, Button, Flex, Image, Text, VStack} from "@chakra-ui/react";

// 숫자 확인 함수
function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseInt(value));
}

// 숫자 포맷팅 함수
function formatPrice(value) {
    if (isNumeric(value)) {
        return parseInt(value).toLocaleString() + '원';
    }
    return value;
}

export function MenuList({menuList, cart, handleAdd, handleRemove}) {
    return (
        <VStack spacing={4} align="stretch">
            {menuList.map((menu, index) => (
                <Flex
                    key={index}
                    justifyContent="space-between"
                    alignItems="center"
                    p={4}
                    borderWidth={1}
                    borderRadius="lg"
                >
                    <Box>
                        {menu.img && <Image src={menu.img} boxSize="100px"/>}
                        <Text fontWeight="bold" mt={2}>
                            {menu.menu}
                        </Text>
                        <Text>{formatPrice(menu.price)}</Text>
                    </Box>
                    <Flex alignItems="center">
                        <Button
                            onClick={() => handleRemove(menu)}
                            colorScheme="teal"
                            size="sm"
                            mr={2}
                        >
                            -
                        </Button>
                        <Text>{cart[menu.menu]?.count || 0}</Text>
                        <Button
                            onClick={() => handleAdd(menu)}
                            colorScheme="teal"
                            size="sm"
                            ml={2}
                        >
                            +
                        </Button>
                    </Flex>
                </Flex>
            ))}
        </VStack>
    );
}
