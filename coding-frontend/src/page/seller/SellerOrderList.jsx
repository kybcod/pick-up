import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

function SellerOrderList(props) {
  const account = useContext(LoginContext);
  const userId = account.id;
  const [groupedReceivedOrders, setGroupedReceivedOrders] = useState({});

  useEffect(() => {
    axios.get(`/api/seller/orders/${userId}`).then((res) => {
      const data = res.data;
      const grouped = data.reduce((groups, item) => {
        (groups[item.orderUserId] = groups[item.orderUserId] || []).push(item);
        return groups;
      }, {});
      setGroupedReceivedOrders(grouped);
    });
  }, []);

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      {Object.keys(groupedReceivedOrders).length === 0 ? (
        <Flex direction="column" align="center" justify="center" height="500px">
          <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4} />
          <Text fontSize="2xl" textAlign="center" color="gray.500">
            받으신 주문 내역이 없습니다ㅠ
          </Text>
        </Flex>
      ) : (
        <VStack spacing={6} align="stretch">
          {Object.entries(groupedReceivedOrders).map(
            ([orderUserId, orders]) => (
              <Box
                key={orderUserId}
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="md"
                bg="white"
              >
                {orders.map((order, index) => (
                  <Box key={index} mt={4}>
                    <Text fontSize="xl" fontWeight="bold" mb={3}>
                      주문 번호: {order.merchantUid}
                    </Text>
                    <HStack spacing={4} align="center" mb={2}>
                      <Image
                        src={order.logo}
                        boxSize="50px"
                        borderRadius="full"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{order.restaurantName}</Text>
                        <Badge colorScheme="green">주문 접수</Badge>
                      </VStack>
                    </HStack>
                    <Divider my={2} />
                    <Text fontSize="sm">주문자: {order.buyerName}</Text>
                    <Text fontSize="sm">연락처: {order.buyerTel}</Text>
                    <Divider my={2} />
                    <HStack justify="space-between">
                      <Text fontSize="sm">
                        가게 전화번호: {order.phoneNumber}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        주문 금액: {order.totalPrice.toLocaleString()} 원
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </Box>
            ),
          )}
        </VStack>
      )}
    </Box>
  );
}

export default SellerOrderList;
