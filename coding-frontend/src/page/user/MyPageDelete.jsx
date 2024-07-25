import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";

export function MyPageDelete({ user, setUser, prevPassword, setPrevPassword }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userId } = useParams();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/user/${userId}`).then((res) => setUser(res.data));
  }, []);

  function handleClickDelete() {
    axios
      .delete(`/api/user/delete`, { data: { ...user, prevPassword } })
      .then((res) => {
        toast({
          status: "info",
          description: "회원 탈퇴 되었습니다.",
          position: "top",
        });
        account.logout(res.data.token);
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원 탈퇴에 실패했습니다. 다시 시도해주세요.",
          position: "top",
        });
      })
      .finally();
  }

  return (
    <Box>
      <Button colorScheme={"red"} onClick={onOpen}>
        회원탈퇴
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 정보 확인</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>회원의 패스워드를 입력해주세요</FormLabel>
              <Input onChange={(e) => setPrevPassword(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme={"blue"} onClick={handleClickDelete}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
