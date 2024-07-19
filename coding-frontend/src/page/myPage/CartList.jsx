import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";

export function CartList() {
    const account = useContext(LoginContext);
    const userId = account.id;
    const [cartItems, setCartItems] = useState(null);
    const navigate = useNavigate();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [placeId, setPlaceId] = useState(null);

    useEffect(() => {
        axios
            .get(`/api/carts/${userId}`)
            .then((res) => {
                console.log("장바구니 데이터 조회 성공:", res.data);
                const groupedByRestaurant = groupCartByRestaurant(res.data);
                setCartItems(groupedByRestaurant);
            })
            .catch((err) => {
                console.error("장바구니 데이터 조회 실패:", err);
            });
    }, [userId]);

    const groupCartByRestaurant = (cartItems) => {
        const grouped = {};
        cartItems.forEach((item) => {
            const key = item.restaurantId;
            if (!grouped[key]) {
                grouped[key] = {
                    items: [],
                    // totalPrice: 0,
                };
            }
            grouped[key].items.push(item);
            // grouped[key].totalPrice += parseInt(item.totalPrice);
        });
        return grouped;
    };

    if (cartItems === null) {
        return <Spinner size="xl"/>;
    }

    function handleCartDelete() {
        axios
            .delete(`api/carts/${userId}/${placeId}`)
            .then(() => {
                setCartItems((prevItems) => {
                    const updatedItems = {...prevItems};
                    delete updatedItems[placeId];
                    return updatedItems;
                });
                console.log("장바구니 삭제 성공");
            })
            .catch(() => console.log("장바구니 삭제 실패"))
            .finally(() => onClose());
    }

    function handleConfirmDelete(restaurantId) {
        setPlaceId(restaurantId);
        onOpen();
    }

    return (
        <Box maxW="800px" margin="auto" p={5}>
            <Heading mb={6}>장바구니</Heading>
            {Object.keys(cartItems).length === 0 ? (
                <Flex direction="column" align="center" justify="center" height="500px">
                    <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4}/>
                    <Text fontSize="2xl" textAlign="center" color="gray.500">
                        장바구니가 텅 비었어요
                    </Text>
                </Flex>
            ) : (
                <VStack spacing={6} align="stretch">
                    {Object.keys(cartItems).map((restaurantId) => (
                        <Box
                            key={restaurantId}
                            borderWidth="1px"
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                        >
                            <Text
                                cursor="pointer"
                                fontSize="2xl"
                                fontWeight="bold"
                                mb={4}
                                onClick={() => navigate(`/menu/${restaurantId}`)}
                                color="teal.500"
                            >
                                가게 ID: {restaurantId}
                            </Text>
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>메뉴</Th>
                                            <Th>수량</Th>
                                            <Th>가격</Th>
                                            <Th>합계 가격</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {cartItems[restaurantId].items.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{item.menuName}</Td>
                                                <Td>
                                                    <Button mr={2}>-</Button>
                                                    {item.menuCount}
                                                    <Button ml={2}>+</Button>
                                                </Td>
                                                <Td>{item.menuPrice} 원</Td>
                                                <Td>
                                                    {(
                                                        item.menuCount *
                                                        parseInt(item.menuPrice.replace(/,/g, ""))
                                                    ).toLocaleString()}
                                                    원
                                                </Td>
                                            </Tr>
                                        ))}
                                        <Tr>
                                            <Td colSpan={2} fontWeight="bold" textAlign="right">
                                                총 가격:
                                            </Td>
                                            <Td fontWeight="bold">
                                                {/*{cartItems[restaurantId].totalPrice.toLocaleString()} 원*/}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Flex justifyContent={"flex-end"}>
                                <Button
                                    onClick={() => handleConfirmDelete(restaurantId)}
                                    colorScheme="teal"
                                    variant="solid"
                                    size="lg"
                                    mt={3}
                                    mr={3}
                                >
                                    장바구니 삭제
                                </Button>
                                <Button colorScheme="teal" variant="solid" size="lg" mt={3}>
                                    주문하기
                                </Button>
                            </Flex>
                        </Box>
                    ))}

                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay/>
                        <ModalContent>
                            <ModalHeader>삭제</ModalHeader>
                            <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
                            <ModalFooter>
                                <Button colorScheme="red" onClick={handleCartDelete}>
                                    삭제
                                </Button>
                                <Button onClick={onClose}>취소</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </VStack>
            )}
        </Box>
    );
}
