import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [nickName, setNickName] = useState("");
  const [role, setRole] = useState(null);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNickNameChecked, setIsNickNameChecked] = useState(false);
  const navigate = useNavigate();
  // const [address, setAddress] = useState("");

  let toast = useToast();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setEmail(userInfo.email || "");
      setNickName(userInfo.nickname || "");
      setPhoneNum(userInfo.mobile || "");
    }
  }, []);

  function handleClick() {
    if (!isEmailChecked) {
      toast({
        status: "warning",
        description: "이메일 중복 확인을 해주세요.",
        position: "top",
        duration: 3000,
      });
      return;
    }
    if (!isNickNameChecked) {
      toast({
        status: "warning",
        description: "닉네임 중복 확인을 해주세요.",
        position: "top",
        duration: 3000,
      });
      return;
    }

    const authorities = [{ userId: null, name: role }];
    axios
      .post("/api/user/signup", {
        email,
        password,
        phoneNum,
        nickName,
        authorities,
        // address,
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원가입이 완료되었습니다",
          position: "top",
          duration: 3000,
        });
        localStorage.removeItem("userInfo");
        navigate("/login");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "top",
            duration: 3000,
          });
        }
        if (!role) {
          toast({
            status: "warning",
            description: "권한을 선택해 주세요.",
            position: "top",
            duration: 3000,
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "top",
            duration: 3000,
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
          duration: 3000,
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 이메일입니다",
            position: "top",
            duration: 3000,
          });
        }
        setIsEmailChecked(true);
      })
      .finally();
  }

  function handleCheckNickName() {
    axios
      .get(`/api/user/check?nickName=${nickName}`)
      .then(() => {
        toast({
          status: "warning",
          description: "사용할 수 없는 닉네임입니다",
          position: "top",
          duration: 3000,
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다",
            position: "top",
            duration: 3000,
          });
        }
        setIsNickNameChecked(true);
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

  let isDisableSaveButton = false;

  if (!isEmailChecked) {
    isDisableSaveButton = true;
  }

  if (!isNickNameChecked) {
    isDisableSaveButton = true;
  }

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading mt={4} color="#2AC1BC" fontSize="3xl">
            회원가입
          </Heading>
        </Box>

        <Box bg="white" p={8} borderRadius="xl" boxShadow="xl">
          <VStack spacing={6}>
            <RadioGroup name="authorities">
              <Stack spacing={5} direction="row">
                <Radio
                  colorScheme="green"
                  value="seller"
                  onChange={(e) => setRole(e.target.value)}
                >
                  판매자
                </Radio>
                <Radio
                  colorScheme="green"
                  value="buyer"
                  onChange={(e) => setRole(e.target.value)}
                >
                  구매자
                </Radio>
              </Stack>
            </RadioGroup>

            <FormControl>
              <FormLabel>아이디</FormLabel>
              <InputGroup>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsEmailChecked(false);
                  }}
                  borderRadius="full"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleCheckEmail}
                    isDisabled={isEmailChecked}
                    bgColor="#2AC1BC"
                  >
                    중복확인
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText>
                올바른 이메일 형식으로 입력해주세요
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>패스워드</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                borderRadius="full"
              />
            </FormControl>

            <FormControl>
              <FormLabel>패스워드 확인</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPasswordCheck(e.target.value)}
                borderRadius="full"
              />
              {!pwIsMatch && (
                <FormHelperText color="red.500">
                  패스워드가 일치하지 않습니다
                </FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>전화번호</FormLabel>
              <Input
                value={phoneNum}
                onChange={(e) =>
                  setPhoneNum(phoneNumPattern(e.currentTarget.value))
                }
                borderRadius="full"
              />
            </FormControl>

            <FormControl>
              <FormLabel>닉네임</FormLabel>
              <InputGroup>
                <Input
                  value={nickName}
                  onChange={(e) => {
                    setNickName(e.target.value);
                    setIsNickNameChecked(false);
                  }}
                  borderRadius="full"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleCheckNickName}
                    isDisabled={isNickNameChecked}
                    bgColor="#2AC1BC"
                  >
                    중복확인
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              onClick={handleClick}
              isDisabled={isDisableSaveButton}
              bgColor="#2AC1BC"
              size="lg"
              width="100%"
              borderRadius="full"
            >
              가입하기
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
