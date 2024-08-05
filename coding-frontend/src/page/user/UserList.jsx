import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function UserList() {
  const [userList, setUserList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const toast = useToast();
  let { isOpen, onOpen, onClose } = useDisclosure();
  const account = useContext(LoginContext);

  const currentPage = parseInt(searchParam.get("page")) || 1;

  useEffect(() => {
    // Fetch user data only if not processing
    if (!isProcessing) {
      axios.get(`/api/user/list?page=${currentPage}`).then((res) => {
        setUserList(res.data.userList);
        setPageInfo(res.data.pageInfo);
      });
    }
  }, [searchParam, isProcessing]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleClickPage(pageNumber) {
    setSearchParam({ page: pageNumber });
  }

  function handleClickAdminDelete(user) {
    setSelectedUser(user);
    onOpen();
  }

  function confirmDelete() {
    setIsProcessing(true);
    axios
      .delete(`/api/user/admin/delete`, { data: selectedUser })
      .then(() => {
        toast({
          status: "info",
          description: "회원 삭제 되었습니다.",
          position: "top",
        });
        onClose();
        setSelectedUser(null);
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원 삭제에 실패했습니다. 다시 시도해주세요.",
          position: "top",
        });
      })
      .finally(() => {
        setIsProcessing(false);
      });
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
          {userList.map((user, index) => (
            <Tr key={user.id}>
              <Td>{(currentPage - 1) * 10 + index + 1}</Td>
              <Td>{user.email}</Td>
              <Td>{user.nickName}</Td>
              <Td>{user.inserted}</Td>
              <Td>
                <Button
                  colorScheme={"red"}
                  onClick={() => handleClickAdminDelete(user)}
                >
                  회원삭제
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Center>
        {pageNumbers.map((pageNumber) => (
          <Button
            m={1}
            key={pageNumber}
            onClick={() => handleClickPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <Box>
                <p>이 사용자를 삭제하시겠습니까?</p>
                <p>이메일: {selectedUser.email}</p>
                <p>닉네임: {selectedUser.nickName}</p>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmDelete}>
              삭제
            </Button>
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
