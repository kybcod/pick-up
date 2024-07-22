import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useParams } from "react-router-dom";

export function MyPage() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  let { userId } = useParams();
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

  return (
    <Box>
      <Heading>로그인</Heading>
      <Box>
        <FormControl>
          <FormLabel>아이디</FormLabel>
          <Input defaultValue={user.email} />
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
          <Input defaultValue={user.nickName} />
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
