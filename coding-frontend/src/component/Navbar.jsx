import { Box, Button, Flex, Image, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { DrawerExample } from "./DrawerExample.jsx";
import { LoginContext } from "./LoginProvider.jsx";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <Box cursor="pointer" w="150px" onClick={() => navigate("/seller")}>
        seller
      </Box>

      <Spacer />
      {account.isBuyer() ? (
        <DrawerExample />
      ) : (
        <Box>
          {account.isSeller() && (
            <Button
              onClick={() => {
                account.logout();
                navigate("/login");
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
          )}
        </Box>
      )}
    </Flex>
  );
}
