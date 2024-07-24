import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMotorcycle,
  faWonSign,
} from "@fortawesome/free-solid-svg-icons";

export function Payment() {
  const { userId, restaurantId } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [merchantUid, setMerchantUid] = useState("");
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(iamport);
    };
  }, []);

  useEffect(() => {
    axios.get(`/api/orders/${userId}/${restaurantId}`).then((res) => {
      console.log(res.data);
      setPaymentInfo(res.data);
      generateMerchantUid();
    });
  }, [userId, restaurantId]);

  // 주문번호 랜덤으로 받기
  function generateMerchantUid() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let orderNum = month + day;
    for (let i = 0; i < 10; i++) {
      orderNum += Math.floor(Math.random() * 8);
    }
    setMerchantUid(orderNum);
  }

  function onClickPayment() {
    const { IMP } = window;
    IMP.init(import.meta.env.VITE_KAKAO_KEY);

    const data = {
      // pg: "nice_v2", // 나이스/
      pg: "kakaopay", // 카카오페이
      pay_method: "card", // 결제수단
      merchant_uid: merchantUid, // 주문번호
      amount: calculateTotalAmount(), // 결제금액
      name: restaurantId, // 주문명
      buyer_name: userId, // 구매자 이름
      m_redirect_url: "/", // 모바일 결제 후 리디렉션될 URL : 채팅방으로
    };

    IMP.request_pay(data, callback);

    const cartIds = paymentInfo.map((info) => info.id);

    function callback(response) {
      const { success, error_msg } = response;

      if (success) {
        axios
          .post(`/api/orders`, {
            merchantUid,
            restaurantId,
            userId,
            cartIds,
            totalPrice: calculateTotalAmount(),
          })
          .then(() => {
            alert(`결제성공`);
            navigate(`/orders`);
          })
          .catch(() => {
            alert("결제 처리 중 오류", error_msg);
          })
          .finally(() => {
            navigate(`/orders`);
          });
      } else {
        alert(`${error_msg}.`);
      }
    }
  }

  // 총 금액 계산 함수
  function calculateTotalAmount() {
    if (!paymentInfo) return 0;
    return paymentInfo.reduce((total, item) => {
      return total + (item.menuPrice || 0) * (item.menuCount || 0);
    }, 0);
  }

  function handleDirectOrders() {
    const cartIds = paymentInfo.map((info) => info.id);

    axios
      .post(`/api/orders`, {
        merchantUid,
        restaurantId,
        userId,
        cartIds,
      })
      .then(() => {
        alert(`주문성공`);
      })
      .catch(() => {
        alert("주문 오류");
      })
      .finally(() => {
        navigate(`/orders`);
      });
  }

  if (paymentInfo === null) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box
      maxW="600px"
      mx="auto"
      p={5}
      boxShadow="xl"
      borderRadius="lg"
      bg={bgColor}
    >
      {paymentInfo && (
        <Box mb={6}>
          <HStack spacing={4}>
            <Image
              src={paymentInfo.image || "/img/pickUp_black.png"}
              boxSize="100px"
              borderRadius="md"
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold">
                {paymentInfo.name || "맛있는 음식점"}
              </Text>
              <HStack>
                <FontAwesomeIcon icon={faMotorcycle} />
                <Text fontSize="sm">
                  배달비 {paymentInfo.deliveryFee || "2,000"}원
                </Text>
              </HStack>
              <HStack>
                <FontAwesomeIcon icon={faClock} />
                <Text fontSize="sm">
                  예상 배달 시간 {paymentInfo.estimatedTime || "40-50"}분
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      )}

      <Divider mb={6} />

      <Text fontSize="xl" fontWeight="bold" mb={4}>
        주문 내역
      </Text>
      <VStack spacing={4} align="stretch" mb={6}>
        {paymentInfo.map((item) => (
          <HStack key={item.id} justify="space-between">
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{item.menuName}</Text>
              <Text fontSize="sm" color="gray.500">
                수량: {item.menuCount}개
              </Text>
            </VStack>
            <Text>{(item.menuPrice * item.menuCount).toLocaleString()}원</Text>
          </HStack>
        ))}
      </VStack>

      <Divider mb={6} />

      <VStack spacing={2} align="stretch" mb={6}>
        <HStack justify="space-between" fontWeight="bold">
          <Text>총 결제 금액</Text>
          <Text>{(calculateTotalAmount() + 2000).toLocaleString()}원</Text>
        </HStack>
      </VStack>

      <Flex justify="space-between">
        <Button onClick={() => navigate(-1)} colorScheme="gray">
          뒤로가기
        </Button>
        {calculateTotalAmount() === 0 ? (
          <Button onClick={handleDirectOrders} colorScheme="blue">
            주문하기
          </Button>
        ) : (
          <Button
            onClick={onClickPayment}
            colorScheme="blue"
            leftIcon={<FontAwesomeIcon icon={faWonSign} />}
          >
            결제하기
          </Button>
        )}
      </Flex>
    </Box>
  );
}
