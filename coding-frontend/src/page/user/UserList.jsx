import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function UserList() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    axios.get(`/api/user/list`).then((res) => {
      setUserList(res.data);
    });
  }, []);
  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>이메일</Th>
            <Th>닉네임</Th>
            <Th>가입일시</Th>
            <Th>삭제</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userList.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.email}</Td>
              <Td>{user.nickName}</Td>
              <Td>{user.inserted}</Td>
              <Td>
                <Button>회원삭제</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
