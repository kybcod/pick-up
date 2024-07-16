import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function Cart() {
  const account = useContext(LoginContext);
  const userId = account.id;
  const [cartItems, setCartItems] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/carts/${userId}`)
      .then((res) => {
        console.log("장바구니 데이터 조회 성공:", res.data);
        // 데이터를 가게별로 구분해서 처리하기
        const groupedByRestaurant = groupCartByRestaurant(res.data);
        setCartItems(groupedByRestaurant);
      })
      .catch((err) => {
        console.error("장바구니 데이터 조회 실패:", err);
      });
  }, [userId]);

  // 가게별로 장바구니 항목을 그룹화하는 함수
  const groupCartByRestaurant = (cartItems) => {
    const grouped = {};
    cartItems.forEach((item) => {
      const key = item.restaurantId;
      if (!grouped[key]) {
        grouped[key] = {
          items: [],
          totalPrice: 0,
        };
      }
      grouped[key].items.push(item);
      grouped[key].totalPrice = parseInt(item.totalPrice);
    });
    return grouped;
  };

  if (cartItems === null) {
    return <Spinner />;
  }

  return (
    <VStack spacing={4} align="stretch">
      {Object.keys(cartItems).map((restaurantId) => (
        <Box key={restaurantId} borderWidth="1px" p={4} borderRadius="md">
          <Text
            cursor={"pointer"}
            fontSize="xl"
            fontWeight="bold"
            mb={2}
            onClick={() => navigate(`/menu/${restaurantId}`)}
          >
            가게 ID: {restaurantId}
          </Text>
          {cartItems[restaurantId].items.map((item, index) => (
            <Box key={index} borderWidth="1px" p={2} borderRadius="md">
              <Text>메뉴: {item.menuName}</Text>
              <Text>수량: {item.menuCount}</Text>
              <Text>가격: {item.menuPrice} 원</Text>
            </Box>
          ))}
          <Box borderWidth="1px" p={2} borderRadius="md" mt={2}>
            <Text>
              총 가격: {cartItems[restaurantId].totalPrice.toLocaleString()} 원
            </Text>
          </Box>
          <Box p={2} borderRadius="md" mt={2}>
            <Button
              w={"100%"}
              bgColor={"#2AC1BC"}
              _hover={{ bgColor: "#2AC1BC" }} // 호버 효과 제거
              _active={{ bgColor: "#23a19d" }} // 클릭 시 배경색 변경
            >
              주문하기
            </Button>
          </Box>
        </Box>
      ))}
    </VStack>
  );
}
