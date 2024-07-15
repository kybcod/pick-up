import { Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex h={"50px"} cursor={"pointer"} backgroundColor={"#2AC1BC"}>
      <Center onClick={() => navigate("map")}>지도</Center>
      <Center onClick={() => navigate("login")}>login</Center>
    </Flex>
  );
}
