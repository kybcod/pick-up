import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./component/Navbar.jsx";
import React, { useContext } from "react";
import { LoginContext } from "./component/LoginProvider.jsx";

export function Home() {
  const account = useContext(LoginContext);

  return (
    <Box>
      {account.isSeller() ? (
        <>
          <Box>
            <Navbar />
          </Box>
          <Box>
            <Outlet />
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Navbar />
          </Box>
          <Box
            mx={{
              base: 0,
              lg: 300,
            }}
            mb={10}
            minHeight="500px"
            position="relative"
            paddingBottom="100px"
          >
            <Outlet />
          </Box>
        </>
      )}
    </Box>
  );
}
