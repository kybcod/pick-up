import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex h={"55px"} cursor={"pointer"} backgroundColor={"#2AC1BC"}>
      <Box>
        <Box cursor={"pointer"} w={"200px"} onClick={() => navigate("/")}>
          <Image src={"/img/pickUp_black.png"} />
        </Box>
      </Box>
      {account.isLoggedIn() || (
        <Center>
          <Center onClick={() => navigate("login")}>login</Center>
        </Center>
      )}
      {account.isLoggedIn() && (
        <Center>
          <Center
            onClick={() => {
              account.logout();
              navigate("/");
            }}
          >
            logout
          </Center>
        </Center>
      )}
      <DrawerExample />
    </Flex>
  );
}

function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const handleNavigateTo = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{account.nickName}</DrawerHeader>

          <DrawerBody>
            <Box
              mb={4}
              cursor="pointer"
              onClick={() => handleNavigateTo("/carts")}
            >
              <Text fontWeight="bold" mb={2}>
                장바구니
              </Text>
            </Box>

            <Box
              mb={4}
              cursor="pointer"
              onClick={() => handleNavigateTo("/orders")}
            >
              <Text fontWeight="bold" mb={2}>
                주문 내역
              </Text>
            </Box>

            <Box
              mb={4}
              cursor="pointer"
              onClick={() => handleNavigateTo("/favorites")}
            >
              <Text fontWeight="bold" mb={2}>
                찜한 가게
              </Text>
            </Box>
            <Box
              mb={4}
              cursor="pointer"
              onClick={() => handleNavigateTo("/reviews")}
            >
              <Text fontWeight="bold" mb={2}>
                리뷰 내역
              </Text>
            </Box>
            {/*TODO: 판매자만 입점하기*/}
            <Box
              mb={4}
              cursor="pointer"
              onClick={() => handleNavigateTo("/register")}
            >
              <Text fontWeight="bold" mb={2}>
                입점하기
              </Text>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="blue" mr={3}>
              저장
            </Button>
            <Button variant="outline">취소</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
