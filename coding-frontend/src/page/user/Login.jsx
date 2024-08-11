import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Heading,
  Image,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const reUri = "http://localhost:5173/oauth/login";
  const state = Math.random();

  function handleClickLogin() {
    axios
      .post("/api/user/login", { email, password })
      .then((res) => {
        account.login(res.data.token);
        toast({
          status: "success",
          description: "로그인 되었습니다",
          position: "top",
          duration: 3000,
        });
        if (res.data.isSeller) {
          navigate("/seller");
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        account.logout();
        toast({
          status: "error",
          description: "이메일과 패스워드를 확인해주세요",
          position: "top",
          duration: 3000,
        });
      });
  }

  return (
    <Box
      p={8}
      maxWidth="400px"
      margin="auto"
      mt={20}
      boxShadow="xl"
      borderRadius="lg"
      bg="white"
    >
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center" color="#2AC1BC" fontSize="2xl">
          로그인
        </Heading>
        <FormControl>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디를 입력해주세요"
            size="lg"
            borderRadius="full"
          />
        </FormControl>
        <FormControl>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="패스워드를 입력해주세요"
            size="lg"
            borderRadius="full"
          />
        </FormControl>
        <Button
          onClick={handleClickLogin}
          width="100%"
          bgColor="#2AC1BC"
          size="lg"
          borderRadius="full"
        >
          로그인
        </Button>

        <Divider />
        <Center>
          <Text
            color="#2AC1BC"
            fontWeight="bold"
            onClick={() => navigate("/signup")}
            cursor="pointer"
          >
            회원가입
          </Text>
        </Center>
        <Center>
          <a
            href={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=cOENA5ySQ3knmQd0ghMS&redirect_uri=${reUri}&state=${state}`}
          >
            <Image boxSize="40px" src="/img/naver.png" />
          </a>
        </Center>
      </VStack>
    </Box>
  );
}

export default Login;
