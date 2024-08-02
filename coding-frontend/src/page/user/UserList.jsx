import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function UserList() {
  const [userList, setUserList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParam.get("page")) || 1;

  useEffect(() => {
    axios.get(`/api/user/list?page=${currentPage}`).then((res) => {
      setUserList(res.data.userList);
      setPageInfo(res.data.pageInfo);
    });
  }, [searchParam]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleClickPage(pageNumber) {
    setSearchParam({ page: pageNumber });
  }

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
      <Box>
        {pageNumbers.map((pageNumber) => (
          <Button key={pageNumber} onClick={() => handleClickPage(pageNumber)}>
            {pageNumber}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
