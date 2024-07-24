import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReviewModal } from "./ReviewModal.jsx";

export function OrderList() {
  const account = useContext(LoginContext);
  const userId = account.id;
  const [orderList, setOrderList] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const navigate = useNavigate();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    setIsLoading(true); // 데이터 로딩 시작
    axios
      .get(`/api/orders/${userId}`)
      .then((res) => {
        console.log("주문 데이터:", res.data);
        const groupedOrders = groupOrders(res.data);
        setOrderList(groupedOrders);

        const restaurantIds = [
          ...new Set(res.data.map((order) => order.restaurantId)),
        ];

        Promise.all(
          restaurantIds.map((id) =>
            axios.get(`/api/menus/${id}`).then((res) => ({
              id,
              data: res.data,
            })),
          ),
        )
          .then((responses) => {
            console.log("레스토랑 데이터:", responses);
            const info = {};
            responses.forEach(({ id, data }) => {
              info[id] = data.basicInfo;
            });
            setRestaurantInfo(info);
            setIsLoading(false); // 데이터 로딩 완료
          })
          .catch((err) => {
            console.error("가게 데이터 조회 실패:", err);
            setIsLoading(false); // 데이터 로딩 완료
          });
      })
      .catch((err) => {
        console.error("주문 데이터 조회 실패:", err);
        setIsLoading(false); // 데이터 로딩 완료
      });
  }, [userId]);

  const groupOrders = (orders) => {
    return orders.reduce((acc, order) => {
      const key = `${order.orderId}`;
      if (!acc[key]) {
        acc[key] = {
          restaurantId: order.restaurantId,
          inserted: order.inserted,
          pickUpStatus: order.pickUpStatus,
          paymentStatus: order.paymentStatus,
          estimatedTime: order.estimatedTime,
          reviewStatus: order.reviewStatus,
          items: [],
        };
      }
      acc[key].items.push(order);
      return acc;
    }, {});
  };

  function handleOpenModal(restaurantId) {
    setSelectedRestaurant(restaurantId);
    onOpen();
  }

  if (isLoading) {
    // 데이터 로딩 중일 때 스피너 표시
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const isOrderListEmpty = Object.keys(orderList).length === 0;

  return (
    <Box maxW="800px" margin="auto" p={5}>
      <Heading mb={6}>주문 내역</Heading>
      {isOrderListEmpty ? (
        <Flex direction="column" align="center" justify="center" height="500px">
          <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4} />
          <Text fontSize="2xl" textAlign="center" color="gray.500">
            주문 내역이 텅 비었어요.
          </Text>
        </Flex>
      ) : (
        <VStack spacing={6} align="stretch">
          {Object.values(orderList).map((group, index) => (
            <Box
              key={index}
              borderWidth={1}
              borderRadius="lg"
              p={4}
              boxShadow="md"
            >
              <Box>
                {group.pickUpStatus ? (
                  <>
                    <Badge>픽업완료</Badge>
                    {group.reviewStatus ? (
                      <Button onClick={() => navigate("/reviews")}>
                        리뷰 보러 가기
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleOpenModal(group.restaurantId)}
                      >
                        리뷰쓰기
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {group.estimatedTime === null ? (
                      <Badge>접수 완료</Badge>
                    ) : (
                      <Badge>픽업대기 : {group.estimatedTime}</Badge>
                    )}
                  </>
                )}
              </Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text
                  cursor="pointer"
                  fontSize="2xl"
                  fontWeight="bold"
                  onClick={() => navigate(`/menu/${group.restaurantId}`)}
                  color="teal.500"
                >
                  가게 이름 :{" "}
                  {restaurantInfo[group.restaurantId]?.placenamefull ||
                    "정보 없음"}
                </Text>
                <Badge colorScheme="green">
                  {new Date(group.inserted).toLocaleString()}
                </Badge>
              </Flex>
              <Divider mb={3} />
              {group.items.map((item, itemIndex) => (
                <Box key={itemIndex} mb={2}>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">{item.menuName}</Text>
                    <Text>{item.menuCount}개</Text>
                  </Flex>
                  {item.menuPrice === null || (
                    <Text color="gray.600">가격: {item.menuPrice}원</Text>
                  )}
                </Box>
              ))}
              <Divider mt={3} mb={3} />
              <Flex justify="flex-end">
                <Text fontWeight="bold">
                  총 금액:{" "}
                  {group.items
                    .reduce((sum, item) => {
                      return sum + item.menuCount * item.menuPrice;
                    }, 0)
                    .toLocaleString()}
                  원
                </Text>
              </Flex>
              <ReviewModal
                restaurantName={
                  restaurantInfo[group.restaurantId]?.placenamefull ||
                  "정보 없음"
                }
                isOpen={isOpen}
                onClose={onClose}
                selectedRestaurant={selectedRestaurant}
                userId={userId}
              />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
