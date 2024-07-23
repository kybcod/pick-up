import React from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function SellerMainPage(props) {
  const navigate = useNavigate();

  const handlePath = (path) => {
    navigate(path);
  };

  return (
    <Box>
      <Box onClick={() => handlePath("register")}>가게 등록</Box>
      <Box>주문 확인</Box>
      <Box>내 정보 관리</Box>
      <Box>가게 관리</Box>
    </Box>
  );
}

export default SellerMainPage;
