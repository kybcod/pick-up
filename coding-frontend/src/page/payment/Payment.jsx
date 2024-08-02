import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWonSign } from "@fortawesome/free-solid-svg-icons";

export function Payment() {
  const { userId, restaurantId } = useParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [merchantUid, setMerchantUid] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const navigate = useNavigate();

  const primaryColor = "#2AC1BC"; // 배달의민족 메인 색상

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

  useEffect(() => {
    axios.get(`/api/menus/${restaurantId}`).then((res) => {
      console.log("resat", res.data);
      setRestaurantData(res.data);
    });
  }, []);

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
      // pg: "nice_v2", // 나이스
      pg: "kakaopay",
      pay_method: "card",
      merchant_uid: merchantUid,
      amount: calculateTotalAmount(),
      name: restaurantId,
      buyer_name: userId,
      m_redirect_url: "/",
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
            alert(`결제가 완료되었습니다.`);
            navigate(`/orders`);
            window.scrollTo({ top: 0, behavior: "auto" });
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

  if (paymentInfo === null || restaurantData === null) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <Box
        maxW="600px"
        mx="auto"
        borderRadius="lg"
        overflow="hidden"
        border={"1px solid #2AC1BC"}
      >
        {/* 헤더 */}
        <Box bg={primaryColor} color="white" p={4}>
          <Text fontSize="2xl" fontWeight="bold">
            결제하기
          </Text>
        </Box>

        {/* 콘텐츠 */}
        <Box p={6}>
          {paymentInfo && restaurantData && (
            <Flex mb={6} align="center">
              <Image
                src={
                  restaurantData?.basicInfo?.mainphotourl ||
                  "/img/pickUp_black.png"
                }
                boxSize="80px"
                borderRadius="md"
                mr={4}
              />
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" fontWeight="bold">
                  {restaurantData?.basicInfo?.placenamefull}
                </Text>
              </VStack>
            </Flex>
          )}

          <Divider mb={6} />

          <Text fontSize="xl" fontWeight="bold" mb={4}>
            주문 내역
          </Text>

          <VStack spacing={4} align="stretch" mb={6}>
            {paymentInfo.map((item) => {
              const menu =
                restaurantData?.menuInfo?.menuList.find(
                  (menuItem) => menuItem.menu === item.menuName,
                ) || {};

              return (
                <Flex
                  key={item.id}
                  bg="gray.100"
                  borderRadius="md"
                  justify="space-between"
                  align="center"
                  p={4}
                >
                  <Flex align="center" flex={1}>
                    {menu.img && (
                      <Image
                        src={menu.img}
                        boxSize="60px"
                        objectFit="cover"
                        borderRadius="md"
                        mr={4}
                      />
                    )}
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="md">
                        {item.menuName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {item.menuPrice.toLocaleString()}원 x {item.menuCount}개
                      </Text>
                    </VStack>
                  </Flex>
                  <Text fontWeight="bold" fontSize="lg">
                    {(item.menuPrice * item.menuCount).toLocaleString()}원
                  </Text>
                </Flex>
              );
            })}
          </VStack>
          <Divider mb={6} />

          <Box bg={primaryColor} color="white" p={4} borderRadius="md" mb={6}>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg">총 결제 금액</Text>
              <Text fontSize="2xl" fontWeight="bold">
                {calculateTotalAmount().toLocaleString()}원
              </Text>
            </Flex>
          </Box>

          <Flex justify="space-between">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              colorScheme="gray"
            >
              뒤로가기
            </Button>
            {calculateTotalAmount() === 0 ? (
              <Button
                onClick={handleDirectOrders}
                bg={primaryColor}
                color="white"
                _hover={{ bg: "#249A95" }}
              >
                주문하기
              </Button>
            ) : (
              <Button
                onClick={onClickPayment}
                bg={primaryColor}
                color="white"
                _hover={{ bg: "#249A95" }}
                leftIcon={<FontAwesomeIcon icon={faWonSign} />}
              >
                결제하기
              </Button>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
