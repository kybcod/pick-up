import {Box, Button, Flex, Image, Text, VStack} from "@chakra-ui/react";

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
                        <Text>{menu.price.toLocaleString()}원</Text>
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
