import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MenuList } from "./MenuList.jsx";
import { SelectedMenuList } from "./SelectedMenuList.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faMotorcycle,
  faPhone,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export function RestaurantMenuList() {
  const { placeId } = useParams();
  const [placeInfo, setPlaceInfo] = useState(null);
  const [cart, setCart] = useState({});
  const account = useContext(LoginContext);
  const userId = account.id;

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    axios.get(`/api/menus/${placeId}`).then((res) => {
      setPlaceInfo(res.data);
    });

    axios.get(`/api/carts/${userId}/${placeId}`).then((res) => {
      const cartData = res.data.reduce((acc, item) => {
        acc[item.menuName] = {
          menu: item.menuName,
          price: item.menuPrice,
          count: item.menuCount,
        };
        return acc;
      }, {});
      setCart(cartData);
      console.log(cartData);
    });
  }, [placeId, userId]);

  const handleRemove = (menu) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[menu.menu] && newCart[menu.menu].count > 0) {
        newCart[menu.menu].count -= 1;
        if (newCart[menu.menu].count === 0) {
          delete newCart[menu.menu];
        }
      }
      return newCart;
    });
  };

  const handleAdd = (menu) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[menu.menu]) {
        newCart[menu.menu].count += 1;
      } else {
        newCart[menu.menu] = { ...menu, count: 1 };
      }
      return newCart;
    });
  };

  const handleReset = (menu) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[menu.menu];
      return newCart;
    });

    axios.delete(`/api/carts/${userId}/${placeId}/${menu.menu}`);
  };

  if (placeInfo === null) {
    return <Spinner />;
  }

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Box bg="#2AC1BC" py={6}>
        <Container maxW="container.xl">
          <Heading size="xl" color="white">
            {placeInfo.basicInfo.placenamefull || "음식점 이름 없음"}
          </Heading>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          <Box flex={2}>
            <Box
              borderRadius="lg"
              overflow="hidden"
              boxShadow="xl"
              mb={6}
              position="relative"
            >
              {placeInfo.basicInfo.mainphotourl ? (
                <Image
                  src={placeInfo.basicInfo.mainphotourl}
                  alt={placeInfo.basicInfo.placenamefull}
                  w="100%"
                  h="300px"
                  objectFit="cover"
                />
              ) : (
                <Box
                  w="100%"
                  h="300px"
                  bg="gray.300"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
                </Box>
              )}
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bg="rgba(0,0,0,0.7)"
                p={4}
                color="white"
              >
                <Heading size="lg">
                  {placeInfo.basicInfo.placenamefull || "음식점 이름 없음"}
                </Heading>
                <HStack mt={2}>
                  {placeInfo.basicInfo.category && (
                    <>
                      <Badge colorScheme="green">
                        {placeInfo.basicInfo.category.catename ||
                          "카테고리 없음"}
                      </Badge>
                      <Badge colorScheme="blue">
                        {placeInfo.basicInfo.category.cate1name || "분류 없음"}
                      </Badge>
                    </>
                  )}
                </HStack>
              </Box>
            </Box>

            <VStack
              align="stretch"
              spacing={4}
              bg={cardBgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
            >
              <HStack justify="space-between">
                <HStack>
                  <FontAwesomeIcon icon={faStar} color="#FFD43B" />
                  <Text fontWeight="bold">
                    {placeInfo.basicInfo.feedback
                      ? (
                          placeInfo.basicInfo.feedback.scoresum /
                          placeInfo.basicInfo.feedback.scorecnt
                        ).toFixed(1)
                      : "평점 없음"}
                  </Text>
                  <Text color="gray.500">
                    {placeInfo.basicInfo.feedback
                      ? `(${placeInfo.basicInfo.feedback.scorecnt} 리뷰)`
                      : "(0 리뷰)"}
                  </Text>
                </HStack>
                <HStack>
                  <FontAwesomeIcon icon={faPhone} color="green.500" />
                  <Text>{placeInfo.basicInfo.phonenum || "전화번호 없음"}</Text>
                </HStack>
              </HStack>

              <Divider />

              <Heading size="md">메뉴</Heading>
              {placeInfo.menuInfo && placeInfo.menuInfo.menuList ? (
                <MenuList
                  menuList={placeInfo.menuInfo.menuList}
                  cart={cart}
                  handleAdd={handleAdd}
                  handleRemove={handleRemove}
                />
              ) : (
                <Text>메뉴 정보가 없습니다.</Text>
              )}
            </VStack>
          </Box>

          <Box
            flex={1}
            position="sticky"
            top="20px"
            height="fit-content"
            bg={cardBgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <SelectedMenuList
              cart={cart}
              menuList={placeInfo.menuInfo?.menuList || []}
              placeId={placeId}
              handleReset={handleReset}
            />
          </Box>
        </Flex>
      </Container>

      <Box
        position="fixed"
        bottom={4}
        right={4}
        bg="#2AC1BC"
        color="white"
        borderRadius="full"
        p={3}
        boxShadow="lg"
      >
        <FontAwesomeIcon icon={faMotorcycle} size="lg" />
      </Box>
    </Box>
  );
}
