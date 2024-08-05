import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faWarning } from "@fortawesome/free-solid-svg-icons";

function SellerRestaurantList(props) {
  const account = useContext(LoginContext);
  const userId = account.id;
  const [sellerRestaurants, setSellerRestaurants] = useState(null);
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [restaurantId, setRestaurantId] = useState(0);

  useEffect(() => {
    axios.get(`/api/restaurants/seller/${userId}`).then((res) => {
      setSellerRestaurants(res.data);
    });
  }, [userId]);

  if (sellerRestaurants === null) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  }

  function handleMenuDetails(restaurantId) {
    navigate(`/seller/${restaurantId}`);
  }

  function handleReviewView(e, restaurantId) {
    e.stopPropagation();
    navigate(`/seller/${restaurantId}/reviews`);
  }

  function handleDeleteRestaurant(restaurantId) {
    axios.delete(`/api/menus/${restaurantId}`).then((res) => {
      setSellerRestaurants((prevRestaurants) =>
        prevRestaurants.filter(
          (restaurant) => restaurant.restaurantId !== restaurantId,
        ),
      );
      onClose();
    });
  }

  function handleModal(e, restaurantId) {
    e.stopPropagation();
    setRestaurantId(restaurantId);
    onOpen();
  }

  return (
    <Box maxWidth="800px" margin="auto" p={4}>
      <Heading mb={8} textAlign="center">
        가게 관리
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {sellerRestaurants.map((restaurant, index) => (
          <Box
            onClick={() => handleMenuDetails(restaurant.restaurantId)}
            key={index}
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
            position="relative"
          >
            <Button
              position={"absolute"}
              top={0}
              right={0}
              background={"transparent"}
              onClick={(e) => handleModal(e, restaurant.restaurantId)}
            >
              <FontAwesomeIcon icon={faTrashCan} color="red" />
            </Button>
            <Image
              src={restaurant.logo}
              alt={restaurant.restaurantName}
              height="200px"
              width="100%"
            />
            <Box p={4}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="xl" fontWeight="bold">
                  {restaurant.restaurantName}
                </Text>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={(e) => handleReviewView(e, restaurant.restaurantId)}
                  position="absolute"
                  bottom="10px"
                  right="10px"
                  variant={"outline"}
                >
                  리뷰 보기
                </Button>
              </Flex>
              <Text color="gray.600" fontSize="sm" mb={2}>
                {restaurant.address}
              </Text>
              <Text color="blue.600" fontSize="sm">
                {restaurant.restaurantTel}
              </Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {" "}
            <FontAwesomeIcon icon={faWarning} /> 가게 삭제
          </ModalHeader>
          <ModalBody>정말로 해당 가게를 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleDeleteRestaurant(restaurantId);
              }}
            >
              확인
            </Button>
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default SellerRestaurantList;
