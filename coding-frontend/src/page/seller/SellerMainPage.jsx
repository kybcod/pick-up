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
  const cardBgColor = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("#2AC1BC", "#2AC1BC");
  const textColor = useColorModeValue("gray.600", "gray.200");
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
    <Box w={"100%"}>
      <Box textAlign="center" w="100%">
        <Image
          src={"/img/pick.png"}
          width="100%"
          height="auto"
          maxHeight="600px"
          borderBottomRadius="md"
        />
      </Box>
      <Box bg={bgColor} minHeight="100vh" py={10}>
        <Container maxW="container.lg">
          <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6}>
            {menuItems.map((item, index) => (
              <Box
                key={index}
                onClick={() => navigate(item.path)}
                bg={cardBgColor}
                borderRadius="lg"
                boxShadow="md"
                p={6}
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                position="relative"
              >
                <Flex alignItems="center">
                  <Flex
                    bg={iconColor}
                    borderRadius="full"
                    color="white"
                    mr={4}
                    width="50px"
                    height="50px"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FontAwesomeIcon icon={item.icon} size="lg" />
                  </Flex>
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    {item.text}
                  </Text>
                  {item.path === "/seller/orders" && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="red"
                      borderRadius="full"
                      px={2}
                      py={1}
                      fontSize="sm"
                    >
                      {order}
                    </Badge>
                  )}
                </Flex>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default SellerMainPage;
