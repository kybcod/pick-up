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
    const [restaurantInfo, setRestaurantInfo] = useState({});
    const navigate = useNavigate();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [placeId, setPlaceId] = useState(null);


    useEffect(() => {
        axios.get(`/api/carts/${userId}`)
            .then((res) => {
                console.log("장바구니 데이터 조회 성공:", res.data);
                const groupedByRestaurant = groupCartByRestaurant(res.data);
                setCartItems(groupedByRestaurant);

                const restaurantIds = Object.keys(groupedByRestaurant);
                console.log("레스토랑 ID들:", restaurantIds);

                Promise.all(
                    restaurantIds.map((id) =>
                        axios.get(`/api/menus/${id}`)
                            .then((res) => ({
                                id,
                                data: res.data
                            }))
                    )
                )
                    .then((responses) => {
                        console.log("응답 데이터들:", responses);
                        const info = {};
                        responses.forEach(({id, data}) => {
                            info[id] = data.basicInfo;
                        });
                        setRestaurantInfo(info);
                    })
                    .catch((err) => {
                        console.error("가게 데이터 조회 실패:", err);
                    });
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
                };
            }
            grouped[key].items.push(item);
        });
        return grouped;
    };

    const calculateTotalPrice = (items) => {
        return items.reduce((total, item) => {
            return total + (item.menuPrice || 0) * item.menuCount; // 가격이 없으면 0으로 처리
        }, 0);
    };

    if (cartItems === null || restaurantInfo === null) {
        return <Spinner/>;
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

    function handleRemove(restaurantId, menuId) {
        setCartItems(prevItems => {
            const updatedItems = {...prevItems};
            const restaurant = updatedItems[restaurantId];
            const itemIndex = restaurant.items.findIndex(item => item.id === menuId);

            if (itemIndex !== -1) {
                if (restaurant.items[itemIndex].menuCount > 1) {
                    restaurant.items[itemIndex].menuCount -= 1;
                } else {
                    restaurant.items.splice(itemIndex, 1);
                    if (restaurant.items.length === 0) {
                        delete updatedItems[restaurantId];
                    }
                }
            }

            return updatedItems;
        });
    }

    function handleAdd(restaurantId, menuId) {
        setCartItems(prevItems => {
            const updatedItems = {...prevItems};
            const restaurant = updatedItems[restaurantId];
            const item = restaurant.items.find(item => item.id === menuId);

            if (item) {
                item.menuCount += 1;
            }
            return updatedItems;
        });
    }

    function handleSaveCart() {
        const carts = Object.entries(cartItems).flatMap(([restaurantId, restaurantData]) =>
            restaurantData.items.map((item) => ({
                restaurantId: restaurantId,
                userId: account.id,
                menuName: item.menuName,
                menuCount: item.menuCount,
                menuPrice: item.menuPrice,
                totalPrice: item.menuCount * item.menuPrice,
            }))
        );

        if (carts.length === 0) {
            axios.delete(`/api/carts/${userId}`)
                .then(() => {
                    console.log("장바구니 삭제 성공");
                    setCartItems({});
                })
                .catch((error) => console.error("장바구니 삭제 실패", error));
        } else {
            axios.put("/api/carts", carts)
                .then(() => {
                    console.log("장바구니 업데이트 성공");
                })
                .catch((error) => console.error("장바구니 업데이트 실패", error));
        }
    }

    return (
        <Box maxW="800px" margin="auto" p={5}>
            <Heading mb={6}>장바구니</Heading>
            {Object.keys(cartItems).length === 0 ? (
                <Flex direction="column" align="center" justify="center" height="500px">
                    <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4}/>
                    <Text fontSize="2xl" textAlign="center" color="gray.500">
                        장바구니가 텅 비었어요.
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
                            <Flex display={"flex"} justifyContent={"space-between"}>

                                <Text
                                    cursor="pointer"
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    mb={4}
                                    onClick={() => navigate(`/menu/${restaurantId}`)}
                                    color="teal.500"
                                >
                                    {restaurantInfo[restaurantId]?.placenamefull}
                                </Text>
                                <Button onClick={() => handleConfirmDelete(restaurantId)}>x</Button>
                            </Flex>
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>메뉴</Th>
                                            <Th>수량</Th>
                                            {Object.values(cartItems)[0].items[0]?.menuPrice && <Th>가격</Th>}
                                            <Th>합계 가격</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {cartItems[restaurantId].items.map((item, index) => (
                                            <Tr key={index}>
                                                <Td>{item.menuName}</Td>
                                                <Td>
                                                    <Button mr={2}
                                                            onClick={() => handleRemove(restaurantId, item.id)}>-</Button>
                                                    {item.menuCount}
                                                    <Button ml={2}
                                                            onClick={() => handleAdd(restaurantId, item.id)}>+</Button>
                                                </Td>
                                                {item.menuPrice !== null ? (
                                                    <>
                                                        <Td>{item.menuPrice.toLocaleString()} 원</Td>
                                                        <Td>
                                                            {(
                                                                item.menuCount *
                                                                item.menuPrice
                                                            ).toLocaleString()}
                                                            원
                                                        </Td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Td>-</Td>
                                                        <Td>-</Td>
                                                    </>
                                                )}
                                            </Tr>
                                        ))}
                                        <Tr>
                                            <Td colSpan={3} fontWeight="bold" textAlign="right">
                                                총 가격:
                                            </Td>
                                            <Td fontWeight="bold">
                                                {calculateTotalPrice(cartItems[restaurantId].items).toLocaleString()} 원
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Flex justifyContent={"flex-end"}>
                                <Button
                                    onClick={handleSaveCart}
                                    colorScheme="teal"
                                    variant="solid"
                                    size="lg"
                                    mt={3}
                                    mr={3}
                                >
                                    담기
                                </Button>
                                <Button colorScheme="teal" variant="solid" size="lg" mt={3}
                                        onClick={() => navigate(`/pay/buyer/${account.id}/restaurant/${restaurantId}`)}>
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
