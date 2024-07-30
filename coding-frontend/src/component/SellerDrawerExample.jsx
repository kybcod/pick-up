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
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboardList,
  faCog,
  faRightFromBracket,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

export function SellerDrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const handleNavigateTo = (path) => {
    if (account.isLoggedIn()) {
      navigate("/seller" + path);
      onClose();
    } else {
      navigate("/login");
      onClose();
    }
  };

  const menuItems = [
    { icon: faStore, text: "가게 등록", path: "/register" },
    { icon: faClipboardList, text: "주문 확인", path: "/orders" },
    { icon: faCog, text: "가게 관리", path: "/restaurants" },
  ];

  return (
    <>
      <Button
        ref={btnRef}
        onClick={onOpen}
        bg="transparent"
        _hover={{ bg: "whiteAlpha.300" }}
      >
        <FontAwesomeIcon icon={faBars} color="white" size="lg" />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="#2AC1BC" />
          <DrawerHeader
            borderBottomWidth="1px"
            color="#2AC1BC"
            cursor={"pointer"}
          >
            {account.isLoggedIn() ? (
              <Box onClick={() => handleNavigateTo(`/mypage/${account.id}`)}>
                {account.nickName}님 안녕하세요!
              </Box>
            ) : (
              <Center>
                <Center onClick={() => handleNavigateTo("login")}>
                  로그인
                </Center>
                <Center ml={1} onClick={() => handleNavigateTo("signup")}>
                  / 회원가입
                </Center>
              </Center>
            )}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {menuItems.map((item, index) => (
                <Box
                  key={index}
                  p={3}
                  borderRadius="md"
                  _hover={{ bg: "gray.100", color: "#2AC1BC" }}
                  cursor="pointer"
                  onClick={() => handleNavigateTo(item.path)}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <Text ml={3} display="inline" fontWeight="bold">
                    {item.text}
                  </Text>
                </Box>
              ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            {account.isLoggedIn() && (
              <Button
                variant="outline"
                onClick={() => {
                  account.logout();
                  onClose();
                  navigate("/login");
                }}
                colorScheme="teal"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
