import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [nickName, setNickName] = useState("");
  // const [address, setAddress] = useState("");

  let toast = useToast();

  function handleClick() {
    axios
      .post("/api/user/signup", {
        email,
        password,
        phoneNum,
        nickName,
        // address,
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원가입이 완료되었습니다",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "top",
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "top",
          });
        }
      })
      .finally();
  }

  function handleCheckEmail() {
    axios
      .get(`/api/user/check?email=${email}`)
      .then(() => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 이메일입니다",
            position: "top",
          });
        }
      })
      .finally();
  }

  function handleCheckNickName() {
    axios
      .get(`/api/user?nickName=${nickName}`)
      .then(() => {
        toast({
          status: "warning",
          description: "사용할 수 없는 닉네임입니다",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다",
            position: "top",
          });
        }
      })
      .finally();
  }

  const pwIsMatch = password === passwordCheck;

  const phoneNumPattern = (num) => {
    return num
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, "");
  };

  return (
    <Box>
      <Box>
        <Heading>회원가입</Heading>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>아이디</FormLabel>
          <InputGroup>
            <Input onChange={(e) => setEmail(e.target.value)} />
            <InputRightElement>
              <Button onClick={handleCheckEmail}>중복확인</Button>
            </InputRightElement>
          </InputGroup>
          <FormHelperText>올바른 이메일 형식으로 입력해주세요</FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>패스워드</FormLabel>
          <Input onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>패스워드 확인</FormLabel>
          <InputGroup>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
          </InputGroup>
          {!pwIsMatch && (
            <FormHelperText>패스워드가 일치하지 않습니다</FormHelperText>
          )}
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>전화번호</FormLabel>
          <Input
            onChange={(e) =>
              setPhoneNum(phoneNumPattern(e.currentTarget.value))
            }
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input onChange={(e) => setNickName(e.target.value)} />
            <InputRightElement>
              <Button onClick={handleCheckNickName}>중복확인</Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Box>
      {/*<Box>
        <FormControl>
          <FormLabel>주소</FormLabel>
          <Input onChange={(e) => setAddress(e.target.value)} />
        </FormControl>
      </Box>
      */}
      <Button onClick={handleClick}>가입하기</Button>
    </Box>
  );
}
