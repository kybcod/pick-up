import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  useColorModeValue,
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
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const buttonColor = useColorModeValue("blue.500", "blue.200");
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
    <Box bg={bgColor} minHeight="100vh" py={10}>
      <Container maxW="container.md">
        <Heading as="h1" size="xl" textAlign="center" mb={10}>
          사장님 메인 페이지
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              onClick={() => navigate(item.path)}
              size="lg"
              height="150"
              bg={buttonColor}
              color="white"
              _hover={{ bg: "blue.600" }}
              fontSize="xl"
              flexDirection="column"
              justifyContent="center"
              position="relative" // Required for positioning Badge
            >
              <Box position="relative" display="flex" justifyContent="center">
                <FontAwesomeIcon icon={item.icon} size="2x" />
                {item.path === "/seller/orders" && (
                  <Badge
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    colorScheme="red"
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="sm"
                  >
                    {order}
                  </Badge>
                )}
              </Box>
              <Box mt={2}>{item.text}</Box>
            </Button>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default SellerMainPage;
