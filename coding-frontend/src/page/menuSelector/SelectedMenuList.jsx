import React, {useContext} from "react";
import {Box, Button, Divider, Flex, Heading, Text, VStack,} from "@chakra-ui/react";
import axios from "axios";
import {LoginContext} from "../../component/LoginProvider.jsx";
import {useNavigate} from "react-router-dom";

export function SelectedMenuList({cart, placeId, handleReset}) {
    const account = useContext(LoginContext);
    const totalAmount = Object.values(cart).reduce((total, item) => {
        console.log(item)
        return total + item.price * item.count;
    }, 0);
    const userId = account.id;
    const navigate = useNavigate();

    const handleSaveCart = async () => {
        const cartItems = Object.values(cart).map((item) => ({
            restaurantId: placeId, // 선택한 식당의 ID
            userId: account.id, // 현재 로그인한 사용자의 ID
            menuName: item.menu, // 메뉴 이름
            menuCount: item.count, // 메뉴의 수량
            menuPrice: item.price, // 메뉴의 가격
            totalPrice: totalAmount, // 선택한 메뉴들의 총 금액
        }));

        try {
            if (cartItems.length === 0) {
                await axios.delete(`/api/carts/${userId}/${placeId}`);
                console.log("삭제 성공");
            } else {
                await axios.put("/api/carts", cartItems);
                console.log("성공 : ", cartItems);
            }
        } catch (error) {
            console.log("실패");
        }
    };

    function handleKakaoPay() {
        navigate(`/pay/buyer/${userId}/restaurant/${placeId}`);
    }

    async function handleSaveCartAndKakaoPay() {
        await handleSaveCart();
        handleKakaoPay();
    }

    return (
        <VStack spacing={4} align="stretch" p={4} borderWidth={1} borderRadius="lg">
            {Object.keys(cart).length === 0 ? (
                <Text>장바구니가 비었습니다.</Text>
            ) : (
                Object.values(cart).map((item, index) => (
                    <Box key={index}>
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontWeight="bold">{item.menu}</Text>
                            <Button variant={"unstyled"} onClick={() => handleReset(item)}>
                                x
                            </Button>
                        </Flex>
                        <Flex justifyContent="space-between" alignItems="center">
                            {item.price !== null && <Text>{parseInt(item.price).toLocaleString()}원</Text>}
                            <Text>수량: {item.count}</Text>
                        </Flex>
                    </Box>
                ))
            )}
            <Divider/>
            {Object.keys(cart).length > 0 && (
                <>
                    <Box>
                        {totalAmount !== 0 ?
                            <>
                                <Heading size="md" mt={4}>
                                    합계
                                </Heading>
                                <Text>총 금액: {totalAmount.toLocaleString()}원</Text>
                            </>
                            :
                            <Text>가게에서 직접 계산하세요.</Text>
                        }

                    </Box>
                    <Flex>
                        <Button w={"100%"} mr={2} onClick={handleSaveCart}>
                            장바구니 담기
                        </Button>
                        <Button
                            w={"100%"}
                            bgColor={"#2AC1BC"}
                            _hover={{bgColor: "#2AC1BC"}}
                            _active={{bgColor: "#23a19d"}}
                            onClick={handleSaveCartAndKakaoPay}
                        >
                            주문하기
                        </Button>
                    </Flex>
                </>
            )}
            {Object.keys(cart).length === 0 && (
                <Button w={"100%"} mr={2} onClick={handleSaveCart}>
                    장바구니 담기
                </Button>
            )}
        </VStack>
    );
}
