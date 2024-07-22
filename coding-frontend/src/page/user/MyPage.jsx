import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useParams } from "react-router-dom";

export function MyPage() {
  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [oldNickName, setOldNickName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useParams();
  const toast = useToast();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/user/${userId}`).then((res) => {
      const dataUser = res.data;
      setUser({ ...dataUser });
    });
  }, [userId]);

  function handleClickEdit() {
    setIsEditing(true);
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
      })
      .finally();
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
      <Box>
        <FormControl>
          <FormLabel>패스워드</FormLabel>
          <Input defaultValue={user.password} />
        </FormControl>
      </Box>
      {isEditing && (
        <Box>
          <FormControl>
            <FormLabel>패스워드 확인</FormLabel>
            <Input defaultValue={user.password} />
          </FormControl>
        </Box>
      )}
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input
              defaultValue={user.nickName}
              onChange={(e) => {
                const newNickName = e.target.value;
                setUser({ ...user, nickName: newNickName });
              }}
            />
            {isEditing && (
              <InputRightElement>
                <Button onClick={handleClickCheckNickName}>중복확인</Button>
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
      </Box>
      {account.hasAccess && (
        <Box>
          <Button onClick={handleClickEdit}>수정</Button>
        </Box>
      )}
    </Box>
  );
}
