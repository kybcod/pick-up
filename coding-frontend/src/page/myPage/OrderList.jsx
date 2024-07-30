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
  const [orderList, setOrderList] = useState({});
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const navigate = useNavigate();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("가게 데이터 조회 실패:", err);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.error("주문 데이터 조회 실패:", err);
        setIsLoading(false);
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

  const sortedOrderList = Object.values(orderList).sort((a, b) => {
    return new Date(b.inserted) - new Date(a.inserted);
  });

  function handleOpenModal(restaurantId) {
    setSelectedRestaurant(restaurantId);
    onOpen();
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const isOrderListEmpty = Object.keys(orderList).length === 0;

  function handleReviewDetail() {
    navigate("/reviews");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <Box maxW="800px" margin="auto" p={5}>
      <Heading mb={6} textAlign="center">
        주문 내역
      </Heading>
      {isLoading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : isOrderListEmpty ? (
        <Flex direction="column" align="center" justify="center" height="500px">
          <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4} />
          <Text fontSize="xl" textAlign="center" color="gray.500">
            주문 내역이 텅 비었어요.
          </Text>
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {sortedOrderList.map((group, index) => (
            <Flex
              key={index}
              direction="column"
              bg="gray.50"
              p={4}
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
              transition="all 0.3s"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center">
                  <Image
                    src={
                      restaurantInfo[group.restaurantId]?.mainphotourl ||
                      "https://via.placeholder.com/50"
                    }
                    boxSize="40px"
                    borderRadius="full"
                    mr={3}
                  />
                  <Text
                    cursor="pointer"
                    fontSize="lg"
                    fontWeight="bold"
                    onClick={() => navigate(`/menu/${group.restaurantId}`)}
                    color="teal.600"
                  >
                    {restaurantInfo[group.restaurantId]?.placenamefull ||
                      "정보 없음"}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.500">
                  {new Date(group.inserted).toLocaleString()}
                </Text>
              </Flex>
              <Divider mb={3} />
              <VStack spacing={2} align="stretch">
                {group.items.map((item, itemIndex) => (
                  <Flex key={itemIndex} justify="space-between">
                    <Text>{item.menuName}</Text>
                    <Flex>
                      <Text mr={4}>{item.menuCount}개</Text>
                      {item.menuPrice && (
                        <Text fontWeight="medium">
                          {item.menuPrice?.toLocaleString()}원
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                ))}
              </VStack>
              <Divider my={3} />
              <Flex justify="space-between" align="center" mb={2}>
                <Badge
                  colorScheme={group.pickUpStatus ? "green" : "yellow"}
                  fontSize="sm"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {group.pickUpStatus
                    ? "픽업완료"
                    : group.estimatedTime === null
                      ? "접수 완료"
                      : `픽업대기: ${group.estimatedTime}`}
                </Badge>
                <Text fontWeight="bold" fontSize="md" color="teal.600">
                  총{" "}
                  {group.items
                    .reduce(
                      (sum, item) => sum + item.menuCount * item.menuPrice,
                      0,
                    )
                    .toLocaleString()}
                  원
                </Text>
              </Flex>
              {group.pickUpStatus && (
                <Button
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  mt={2}
                  _hover={{ bg: "teal.50" }}
                  onClick={() =>
                    group.reviewStatus
                      ? handleReviewDetail()
                      : handleOpenModal(group.restaurantId)
                  }
                >
                  {group.reviewStatus ? "리뷰 보기" : "리뷰 작성"}
                </Button>
              )}
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
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
}
