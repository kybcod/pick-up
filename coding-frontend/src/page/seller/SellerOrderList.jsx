import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

function SellerOrderList(props) {
  const account = useContext(LoginContext);
  const userId = account.id;
  const [receivedOrders, setReceivedOrders] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customerOrder, setCustomerOrder] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState("");
  const timeArray = ["10분", "20분", "30분", "40분", "50분", "60분 이상"];
  const [merchantUid, setMerchantUid] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios.get(`/api/orders/seller/${userId}`).then((res) => {
      console.log(res.data);
      setReceivedOrders(res.data);
    });
  }, [userId, isProcessing]);

  function handleOrderReception(userId, merchantUid) {
    axios
      .get(`/api/orders/buy/${userId}/${merchantUid}`)
      .then((res) => {
        setCustomerOrder(res.data);
        setMerchantUid(merchantUid);
        onOpen();
      })
      .catch((error) => {
        console.error("주문 데이터 가져오기 실패:", error);
      });
  }

  function handlePickUpOk() {
    setIsProcessing(true);
    if (!estimatedTime) {
      alert("예상 소요 시간을 선택해주세요.");
      return;
    }

    axios
      .put("/api/orders/time", {
        estimatedTime,
        merchantUid,
      })
      .finally(() => {
        setIsProcessing(false);
        onClose();
      });
  }

  function handlePickUpClear(merchantUid) {
    setIsProcessing(true);
    axios
      .put("/api/orders/pick-up", { merchantUid })
      .then(() => {
        alert("픽업 완료");
        axios.get(`/api/orders/seller/${userId}`).then((res) => {
          setReceivedOrders(res.data);
        });
      })
      .catch(() => alert("픽업 실패"))
      .finally(() => setIsProcessing(false));
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <Heading mb={8} textAlign="center">
        주문 확인
      </Heading>
      {receivedOrders.length === 0 ? (
        <Flex direction="column" align="center" justify="center" height="500px">
          <Image src={"/img/cart_clear.png"} boxSize="150px" mb={4} />
          <Text fontSize="2xl" textAlign="center" color="gray.500">
            받으신 주문 내역이 없습니다ㅠ
          </Text>
        </Flex>
      ) : (
        <VStack spacing={6} align="stretch">
          {receivedOrders.map((order) => (
            <Box
              key={order.merchantUid}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="md"
              bg="white"
              _hover={{ boxShadow: "xl" }}
              transition="all 0.3s"
            >
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                주문 번호: {order.merchantUid}
              </Text>
              <HStack spacing={4} align="center" mb={2}>
                <Image src={order.logo} boxSize="50px" borderRadius="full" />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{order.restaurantName}</Text>
                  <Flex justify="center">
                    {order.estimatedTime === null ? (
                      <Badge
                        colorScheme="green"
                        onClick={() =>
                          handleOrderReception(
                            order.orderUserId,
                            order.merchantUid,
                          )
                        }
                        cursor="pointer"
                      >
                        주문 접수
                      </Badge>
                    ) : (
                      <Button
                        isDisabled={order.pickUpStatus === true}
                        onClick={() => handlePickUpClear(order.merchantUid)}
                        colorScheme="teal"
                        size="sm"
                      >
                        픽업 완료
                      </Button>
                    )}
                  </Flex>
                </VStack>
              </HStack>
              <Divider my={2} />
              <Text fontSize="sm">주문자: {order.buyerName}</Text>
              <Text fontSize="sm">연락처: {order.buyerTel}</Text>
              <Divider my={2} />
              <HStack justify="space-between">
                <Text fontSize="sm">가게 전화번호: {order.phoneNumber}</Text>
                <Text fontSize="sm" fontWeight="bold">
                  주문 금액: {order.totalPrice.toLocaleString()} 원
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      {/* 사장님 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="lg" overflow="hidden" boxShadow="2xl">
          <ModalHeader bg="teal.500" color="white" py={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              주문 내역
            </Text>
          </ModalHeader>
          <ModalBody p={6}>
            {customerOrder && customerOrder.length > 0 ? (
              <VStack align="stretch" spacing={4}>
                <Box bg="gray.100" p={4} borderRadius="md">
                  <Text fontSize="lg" fontWeight="bold">
                    주문 번호: {customerOrder[0].merchantUid}
                  </Text>
                  <Text fontSize="lg">
                    총 주문 금액: {customerOrder[0].totalPrice.toLocaleString()}{" "}
                    원
                  </Text>
                </Box>
                <Divider />
                <Text fontWeight="bold" fontSize="lg">
                  주문 상품:
                </Text>
                {customerOrder.map((item, index) => (
                  <Box key={index} p={4} bg="gray.50">
                    <Text fontSize="md">
                      {item.menuName} x {item.menuCount}
                    </Text>
                    <Text fontSize="md">
                      가격: {item.menuPrice.toLocaleString()} 원
                    </Text>
                  </Box>
                ))}
                <Divider />
                <Text fontWeight="bold" fontSize="lg">
                  예상 소요 시간:
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {timeArray.map((time, index) => (
                    <Button
                      key={index}
                      onClick={() => setEstimatedTime(time)}
                      colorScheme="teal"
                      variant={estimatedTime === time ? "solid" : "outline"}
                    >
                      {time}
                    </Button>
                  ))}
                </Grid>
                <Input
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder={"기타 예상 소요 시간"}
                  mt={3}
                  bg="white"
                  borderColor="teal.500"
                  _placeholder={{ color: "gray.400" }}
                />
              </VStack>
            ) : (
              <Text>주문 내역이 없습니다.</Text>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50" p={4}>
            <Flex justifyContent="flex-end" w="100%">
              <Button
                onClick={handlePickUpOk}
                colorScheme="teal"
                mr={3}
                size="lg"
              >
                주문확인
              </Button>
              <Button onClick={onClose} size="lg">
                닫기
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SellerOrderList;
