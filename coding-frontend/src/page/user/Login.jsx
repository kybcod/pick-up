import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  useToast,
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

  //const CLIENTID = import.meta.env.CLIENT_ID;
  const reUri = "http://localhost:5173/oauth/login/callback";
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
        });
        console.log("is", account.isSeller());
        if (account.isSeller()) {
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
        });
      });
  }

  return (
    <Box>
      <Heading>로그인</Heading>
      <Box>
        <FormControl>
          <FormLabel>아이디</FormLabel>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"아이디를 입력해주세요"}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>패스워드</FormLabel>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"패스워드를 입력해주세요"}
          />
        </FormControl>
      </Box>
      <Button onClick={handleClickLogin}>로그인</Button>
      <Flex mt={10}>
        <a
          href={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=cOENA5ySQ3knmQd0ghMS&redirect_uri=${reUri}&state=${state}`}
        >
          <Image boxSize={"50px"} src={"/img/naver.png"} />
        </a>
        <Button ml={3} onClick={() => navigate("/signup")}>
          회원가입
        </Button>
      </Flex>
    </Box>
  );
}

export default Login;
