import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
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

  useEffect(() => {
    axios.get(`/api/orders/seller/${userId}`).then((res) => {
      console.log(res.data);
      setReceivedOrders(res.data);
    });
  }, []);

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
    if (!estimatedTime) {
      alert("예상 소요 시간을 선택해주세요.");
      return;
    }

    axios
      .put("/api/orders/time", {
        estimatedTime,
        merchantUid,
      })
      .then(() => alert(" 시간성공"))
      .catch(() => alert("시간 실패"));
  }

  function handlePickUpClear(merchantUid) {
    axios
      .put("/api/orders/pick-up", { merchantUid })
      .then(() => {
        alert("픽업성공");
        console.log(merchantUid);

        axios.get(`/api/seller/orders/${userId}`).then((res) => {
          setReceivedOrders(res.data);
        });
      })
      .catch(() => alert("픽업 실패"));
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
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
            >
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                주문 번호: {order.merchantUid}
              </Text>
              <HStack spacing={4} align="center" mb={2}>
                <Image src={order.logo} boxSize="50px" borderRadius="full" />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{order.restaurantName}</Text>
                  <Flex display={"flex"} justifyContent={"center"}>
                    {order.estimatedTime === null ? (
                      <Badge
                        colorScheme="green"
                        onClick={() =>
                          handleOrderReception(
                            order.orderUserId,
                            order.merchantUid,
                          )
                        }
                        cursor={"pointer"}
                      >
                        주문 접수
                      </Badge>
                    ) : (
                      <Badge colorScheme="green" cursor={"pointer"}>
                        조리 중
                      </Badge>
                    )}
                    {order.estimatedTime !== null && (
                      <Button
                        isDisabled={order.pickUpStatus === true}
                        onClick={() => handlePickUpClear(order.merchantUid)}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>주문 내역</ModalHeader>
          <ModalBody>
            {customerOrder && customerOrder.length > 0 ? (
              <VStack align="stretch" spacing={3}>
                <Text>주문 번호: {customerOrder[0].merchantUid}</Text>
                <Text>
                  총 주문 금액: {customerOrder[0].totalPrice.toLocaleString()}{" "}
                  원
                </Text>
                <Divider />
                <Text fontWeight="bold">주문 상품:</Text>
                {customerOrder.map((item, index) => (
                  <Box key={index}>
                    <Text>
                      {item.menuName} x {item.menuCount}
                    </Text>
                    <Text>가격: {item.menuPrice.toLocaleString()} 원</Text>
                  </Box>
                ))}
                <Divider />
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  {timeArray.map((time, index) => (
                    <Button key={index} onClick={() => setEstimatedTime(time)}>
                      {time}
                    </Button>
                  ))}
                </Grid>
                <Input
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder={"기타 예상 소요 시간"}
                />
              </VStack>
            ) : (
              <Text>주문 내역이 없습니다.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Flex display={"flex"} justifyContent={"flex-end"}>
              <Button onClick={handlePickUpOk}>주문확인</Button>
              <Button onClick={onClose}>닫기</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SellerOrderList;
