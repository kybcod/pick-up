import React, { useContext } from "react";
import {
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

function SellerMainPage(props) {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const buttonColor = useColorModeValue("blue.500", "blue.200");

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
            >
              <FontAwesomeIcon icon={item.icon} size="2x" />
              <Box mt={2}>{item.text}</Box>
            </Button>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default SellerMainPage;
