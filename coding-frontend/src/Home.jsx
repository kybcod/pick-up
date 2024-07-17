import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./component/Navbar.jsx";

export function Home() {
  return (
    <Box>
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
    </Box>
  );
}
