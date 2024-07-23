import React, { useContext } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
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
import { useNavigate } from "react-router-dom";

export function SelectedMenuList({ cart, placeId, handleReset }) {
  const account = useContext(LoginContext);
  const totalAmount = Object.values(cart).reduce((total, item) => {
    console.log(item);
    return total + item.price * item.count;
  }, 0);
  const userId = account.id;
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSaveCart = async () => {
    const cartItems = Object.values(cart).map((item) => ({
      restaurantId: placeId, // 선택한 식당의 ID
      userId: account.id, // 현재 로그인한 사용자의 ID
      menuName: item.menu, // 메뉴 이름
      menuCount: item.count, // 메뉴의 수량
      menuPrice: item.price, // 메뉴의 가격
      totalPrice: totalAmount, // 선택한 메뉴들의 총 금액
    }));

    try {
      if (cartItems.length === 0) {
        await axios.delete(`/api/carts/${userId}/${placeId}`);
        console.log("삭제 성공");
      } else {
        await axios.put("/api/carts", cartItems);
        console.log("성공 : ", cartItems);
        navigate("/carts");
      }
    } catch (error) {
      console.log("실패");
    }
  };

  function handleKakaoPay() {
    navigate(`/pay/buyer/${userId}/restaurant/${placeId}`);
  }

  async function handleSaveCartAndKakaoPay() {
    await handleSaveCart();
    handleKakaoPay();
  }

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md" color="#2AC1BC">
        장바구니
      </Heading>
      {Object.keys(cart).length === 0 ? (
        <Text color="gray.500">장바구니가 비었습니다.</Text>
      ) : (
        Object.values(cart).map((item, index) => (
          <Box key={index} p={3} bg="gray.50" borderRadius="md">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold">{item.menu}</Text>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleReset(item)}
              >
                ✕
              </Button>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mt={2}>
              {item.price !== null && (
                <Text>{parseInt(item.price).toLocaleString()}원</Text>
              )}
              <Badge colorScheme="green">{item.count}개</Badge>
            </Flex>
          </Box>
        ))
      )}
      <Divider />
      {Object.keys(cart).length > 0 && (
        <>
          <Box>
            {totalAmount !== 0 ? (
              <>
                <Heading size="md" mt={4} color="#2AC1BC">
                  합계
                </Heading>
                <Text fontSize="xl" fontWeight="bold">
                  {totalAmount.toLocaleString()}원
                </Text>
              </>
            ) : (
              <Text color="gray.500">가게에서 직접 계산하세요.</Text>
            )}
          </Box>
          <Flex direction="column" mt={4}>
            <Button
              mb={2}
              onClick={onOpen}
              colorScheme="gray"
              variant="outline"
            >
              장바구니 담기
            </Button>
            <Button
              bgColor="#2AC1BC"
              color="white"
              _hover={{ bgColor: "#239d99" }}
              _active={{ bgColor: "#1f8683" }}
              onClick={handleSaveCartAndKakaoPay}
            >
              주문하기
            </Button>
          </Flex>
        </>
      )}
      {Object.keys(cart).length === 0 && (
        <Button w="100%" onClick={isOpen} colorScheme="gray" variant="outline">
          장바구니 담기
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxWidth="300px" width="90%">
          <ModalHeader
            borderBottomWidth="1px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            알림
            <Button size="sm" variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </ModalHeader>
          <ModalBody py={6} textAlign="center">
            상품이 장바구니에 담겼습니다.
          </ModalBody>
          <ModalFooter>
            <Button
              w="100%"
              onClick={handleSaveCart}
              bgColor="#2AC1BC"
              color="white"
              _hover={{ bgColor: "#239d99" }}
            >
              장바구니 바로가기 &gt;
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
