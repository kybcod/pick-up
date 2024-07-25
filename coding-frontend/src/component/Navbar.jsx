import { Box, Flex, Image, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { DrawerExample } from "./DrawerExample.jsx";
import { LoginContext } from "./LoginProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      h="60px"
      backgroundColor="#2AC1BC"
      alignItems="center"
      px={4}
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      mb={10}
    >
      <Box cursor="pointer" w="150px" onClick={() => navigate("/")}>
        <Image src="/img/pickUp_black.png" alt="Logo" />
      </Box>
      <Spacer />
      {account.isLoggedIn() || (
        <Center>
          <Center onClick={() => navigate("login")}>login</Center>
          <Center ml={1} onClick={() => navigate("signup")}>
            / sign-up
          </Center>
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
