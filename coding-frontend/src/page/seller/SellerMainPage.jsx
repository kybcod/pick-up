import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import {
  faClipboardList,
  faCog,
  faStore,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function SellerMainPage(props) {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const bgColor = useColorModeValue("#F2F4F6", "#1A202C");
  const cardBgColor = useColorModeValue("white", "#2D3748");
  const iconColor = "#2AC1BC";
  const textColor = useColorModeValue("#4A5568", "#E2E8F0");
  const userId = account.id;
  const [order, setOrder] = useState(0);

  useEffect(() => {
    axios.get(`/api/orders/seller/${userId}/count`).then((res) => {
      setOrder(res.data.orderCount);
    });
  }, [userId]);

  const menuItems = [
    { text: "가게 등록", icon: faStore, path: "/seller/register" },
    { text: "주문 확인", icon: faClipboardList, path: "/seller/orders" },
    { text: "내 정보 관리", icon: faUser, path: `/mypage/${account.id}` },
    { text: "가게 관리", icon: faCog, path: "/seller/restaurants" },
  ];

  return (
    <Box w={"100%"} bg={bgColor} minHeight="100vh">
      <Box textAlign="center" w="100%" position="relative">
        <Image src={"/img/pick.png"} width="100%" maxHeight="600px" />
      </Box>
      <Container maxW="container.lg" py={10}>
        <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={8}>
          {menuItems.map((item, index) => (
            <Box
              key={index}
              onClick={() => {
                if (account.isLoggedIn()) {
                  navigate(item.path);
                  window.scrollTo({ top: 0, behavior: "auto" });
                } else {
                  navigate("/login");
                }
              }}
              bg={cardBgColor}
              borderRadius="xl"
              boxShadow="xl"
              p={8}
              cursor="pointer"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
              position="relative"
            >
              <VStack spacing={4} align="center">
                <Flex
                  bg={iconColor}
                  borderRadius="full"
                  color="white"
                  width="60px"
                  height="60px"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FontAwesomeIcon icon={item.icon} size="2x" />
                </Flex>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {item.text}
                </Text>
                {item.path === "/seller/orders" && (
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme="red"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="md"
                  >
                    {order}
                  </Badge>
                )}
              </VStack>
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default SellerMainPage;
