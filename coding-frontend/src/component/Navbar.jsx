import { Box, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { DrawerExample } from "./DrawerExample.jsx";
import { LoginContext } from "./LoginProvider.jsx";
import { SellerDrawerExample } from "./SellerDrawerExample.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      h="70px"
      backgroundColor="#2AC1BC"
      alignItems="center"
      px={4}
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      mb={account.isSeller() ? 0 : 10}
    >
      {account.isSeller() ? (
        <Box cursor="pointer" w="210px" onClick={() => navigate("/seller")}>
          <Image src="/img/seller_logo.png" alt="Logo" />
        </Box>
      ) : (
        <Box cursor="pointer" w="160px" onClick={() => navigate("/")}>
          <Image src="/img/pickUp_black.png" alt="Logo" />
        </Box>
      )}
      {account.isAdmin() && (
        <Text cursor={"pointer"} onClick={() => navigate("/list")}>
          회원목록
        </Text>
      )}

      <Spacer />
      {account.isSeller() ? <SellerDrawerExample /> : <DrawerExample />}
    </Flex>
  );
}
