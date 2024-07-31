import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

const NaverLoginCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userInfo, setUserInfo] = useState(null);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      axios
        .post("/api/oauth/login/success", { code, state })
        .then((response) => {
          const { token, emailExists, userInfo } = response.data;

          setUserInfo(userInfo);
          setEmailExists(emailExists);

          if (emailExists && token) {
            localStorage.setItem("token", token);
            account.login(token);
            navigate("/");
            toast({
              status: "success",
              description: "로그인 되었습니다",
              position: "top",
            });
          } else if (!emailExists) {
            onOpen();
          } else {
            navigate("/login");
            toast({
              status: "error",
              description: "소셜로그인에 실패하였습니다. 다시 시도해주세요.",
              position: "top",
            });
          }
        })
        .catch(() => {
          navigate("/login");
          toast({
            status: "error",
            description: "소셜로그인에 실패하였습니다. 다시 시도해주세요.",
            position: "top",
          });
        });
    } else {
      navigate("/login");
    }
  }, [location, navigate, account, toast, onOpen]);

  const handleSignUp = () => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    navigate("/signup");
    onClose();
  };

  const handleCancel = () => {
    onClose();
    navigate("/");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>회원가입 안내</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            이메일이 등록되어 있지 않습니다. 회원가입 페이지로 이동하시겠습니까?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSignUp}>
              회원가입
            </Button>
            <Button onClick={handleCancel}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NaverLoginCallback;
