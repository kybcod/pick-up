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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";

export function MyPage() {
  const [user, setUser] = useState({ email: "", password: "", nickName: "" });
  const [prevPassword, setPrevPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [prevNickName, setPrevNickName] = useState("");
  const [nickNameCheck, setNickNameCheck] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useParams();
  const toast = useToast();
  const account = useContext(LoginContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/user/${userId}`).then((res) => {
      const dataUser = res.data;
      setUser({ ...dataUser });
      setPrevNickName(dataUser.nickName);
    });
  }, [userId]);

  function handleClickEdit() {
    setIsEditing(true);
  }

  let isDisableNickNameButton = false;

  if (user.nickName === prevNickName) {
    isDisableNickNameButton = true;
  }
  if (user.nickName === null) {
    isDisableNickNameButton = true;
  }
  if (nickNameCheck) {
    isDisableNickNameButton = true;
  }

  function handleClickCheckNickName() {
    axios
      .get(`/api/user/check?nickName=${user.nickName}`)
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
        setNickNameCheck(true);
      })
      .finally();
  }

  function handleClickSave() {
    axios
      .put(`/api/user/edit`, { ...user, prevPassword })
      .then((res) => {
        toast({
          status: "info",
          description: "회원정보가 수정되었습니다.",
          position: "top",
        });
        setIsEditing(false);
        account.login(res.data.token);
        navigate(`/mypage/${userId}`);
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원정보 수정을 실패했습니다. 다시 시도해주세요.",
          position: "top",
        });
      })
      .finally(() => {
        onClose();
        setPrevPassword("");
      });
  }

  return (
    <Box>
      <Heading>로그인</Heading>
      <Box>
        <FormControl>
          <FormLabel>아이디</FormLabel>
          <Input defaultValue={user.email} readOnly />
        </FormControl>
      </Box>
      {!isEditing && (
        <Box>
          <FormControl>
            <FormLabel>패스워드</FormLabel>
            <Input type={"password"} value={user.password} readOnly />
          </FormControl>
        </Box>
      )}
      {isEditing && (
        <Box>
          <FormControl>
            <FormLabel>패스워드</FormLabel>
            <Input
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>패스워드 확인</FormLabel>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
            {user.password === passwordCheck || (
              <FormHelperText>패스워드가 일치하지 않습니다</FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input
              value={user.nickName}
              onChange={(e) => {
                const newNickName = e.target.value;
                setUser({ ...user, nickName: newNickName });
                setNickNameCheck(newNickName === prevNickName);
              }}
            />
            {isEditing && (
              <InputRightElement>
                <Button
                  onClick={handleClickCheckNickName}
                  isDisabled={isDisableNickNameButton}
                >
                  중복확인
                </Button>
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
      </Box>
      {!isEditing && account.hasAccess && (
        <Box>
          <Button onClick={handleClickEdit}>수정하기</Button>
        </Box>
      )}
      {isEditing && <Button onClick={onOpen}>수정완료</Button>}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>기존 암호 확인</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>기존 암호</FormLabel>
              <Input onChange={(e) => setPrevPassword(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme={"blue"} onClick={handleClickSave}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
