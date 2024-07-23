import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function Payment() {
  const { userId, restaurantId } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [merchantUid, setMerchantUid] = useState("");
  const navigate = useNavigate();

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
    return <Spinner />;
  }

  return (
    <Box
      maxW="600px"
      mx="auto"
      p={5}
      boxShadow="xl"
      borderRadius="lg"
      bg="white"
    >
      <Text fontSize="2xl" mb={4}>
        주문 목록
      </Text>
      {paymentInfo.map((item) => (
        <Box key={item.id} mb={3}>
          <Text>메뉴: {item.menuName}</Text>
          {item.menuPrice === null || (
            <Text>가격: {item.menuPrice.toLocaleString()} 원</Text>
          )}
          <Text>수량: {item.menuCount}</Text>
        </Box>
      ))}
      <Box mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          총 금액: {calculateTotalAmount().toLocaleString()} 원
        </Text>
      </Box>
      <Flex>
        <Button onClick={() => navigate(-1)}>뒤로가기</Button>
        {calculateTotalAmount() === 0 ? (
          <Button onClick={handleDirectOrders} ml={4}>
            주문하기
          </Button>
        ) : (
          <Button onClick={onClickPayment} ml={4}>
            결제하기
          </Button>
        )}
      </Flex>
    </Box>
  );
}
