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
import { useContext } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";

export function CartList({ cart, menuList, placeId }) {
  const account = useContext(LoginContext);
  const totalAmount = Object.values(cart).reduce((total, item) => {
    const priceWithoutComma = item.price.replace(/,/g, "");
    const priceNumber = parseInt(priceWithoutComma, 10);
    return total + priceNumber * item.count;
  }, 0);

  const handleSaveCart = () => {
    const cartItems = Object.values(cart).map((item) => ({
      restaurantId: placeId,
      userId: account.id,
      menuName: item.menu,
      menuCount: item.count,
      menuPrice: item.price,
      totalPrice: totalAmount,
    }));

    axios
      .put("/api/cart", cartItems)
      .then((res) => {
        console.log("성공 : ", res.data);
      })
      .catch(() => console.log("실패"));
  };

  return (
    <VStack spacing={4} align="stretch" p={4} borderWidth={1} borderRadius="lg">
      {Object.keys(cart).length === 0 ? (
        <Text>장바구니가 비었습니다.</Text>
      ) : (
        Object.values(cart).map((item, index) => (
          <Flex key={index} justifyContent="space-between" alignItems="center">
            <Box>
              <Text fontWeight="bold">{item.menu}</Text>
              <Text>{item.price}원</Text>
            </Box>
            <Text>수량: {item.count}</Text>
          </Flex>
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
              장바구니
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
    </VStack>
  );
}
