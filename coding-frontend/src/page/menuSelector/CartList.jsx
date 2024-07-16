// CartList.jsx
import React, { useContext } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function CartList({ cart, placeId, handleReset }) {
  const account = useContext(LoginContext);
  const totalAmount = Object.values(cart).reduce((total, item) => {
    const priceWithoutComma = item.price.replace(/,/g, "");
    const priceNumber = parseInt(priceWithoutComma, 10);
    return total + priceNumber * item.count;
  }, 0);
  const userId = account.id;

  const handleSaveCart = () => {
    const cartItems = Object.values(cart).map((item) => ({
      restaurantId: placeId,
      userId: account.id,
      menuName: item.menu,
      menuCount: item.count,
      menuPrice: item.price,
      totalPrice: totalAmount,
    }));

    if (cartItems.length === 0) {
      axios
        .delete(`/api/carts/${userId}/${placeId}`)
        .then((res) => {
          console.log("삭제 성공");
        })
        .catch(() => console.log("삭제 실패"));
    } else {
      axios
        .put("/api/carts", cartItems)
        .then((res) => {
          console.log("성공 : ", cartItems);
        })
        .catch(() => console.log("실패"));
    }
  };

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
              <Text>{item.price}원</Text>
              <Text>수량: {item.count}</Text>
            </Flex>
          </Box>
        ))
      )}
      <Divider />
      {Object.keys(cart).length > 0 && (
        <>
          <Box>
            <Heading size="md" mt={4}>
              합계
            </Heading>
            <Text>총 금액: {totalAmount.toLocaleString()}원</Text>
          </Box>
          <Flex>
            <Button w={"100%"} mr={2} onClick={handleSaveCart}>
              장바구니 담기
            </Button>
            <Button
              w={"100%"}
              bgColor={"#2AC1BC"}
              _hover={{ bgColor: "#2AC1BC" }} // 호버 효과 제거
              _active={{ bgColor: "#23a19d" }} // 클릭 시 배경색 변경
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
