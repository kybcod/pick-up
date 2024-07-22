import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import PostCode from "../myPage/PostCode.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";

function RegisterRestaurant({ onSubmit }) {
  const [restaurantId, setRestaurantId] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantTel, setRestaurantTel] = useState("");
  const [address, setAddress] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [file, setFile] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const account = useContext(LoginContext);
  const [filePreview, setFilePreview] = useState("/img/pickUp_black.png");

  function handleRegisterRestaurant() {
    axios
      .postForm("/api/restaurants", {
        restaurantId,
        userId: account.id,
        restaurantName,
        restaurantTel,
        address,
        latitude,
        longitude,
        name: categoryName,
        file,
      })
      .then(() => {
        alert("저장 성공");
        onSubmit({
          restaurantId,
          userId: account.id,
          categoryName,
        });
      })
      .catch((error) => {
        console.error("Error saving restaurant:", error);
        alert("저장 실패");
      });
  }

  const handleSelectAddress = (selectedAddress, lat, lng) => {
    setAddress(selectedAddress);
    setLatitude(lat);
    setLongitude(lng);
  };

  const bgColor = useColorModeValue("gray.50", "gray.700");

  function handleChangeLogo(e) {
    const fileView = e.target.files[0];
    setFile(fileView);
    if (fileView) {
      setFilePreview(URL.createObjectURL(fileView));
    } else {
      setFilePreview("/img/pickUp_black.png");
    }
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          가게 등록
        </Heading>

        <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
          <VStack spacing={6}>
            <SimpleGrid columns={2} spacing={6} width="100%">
              <FormControl>
                <FormLabel>사업장 번호</FormLabel>
                <Input
                  type="number"
                  placeholder="10자리 입력"
                  onChange={(e) => setRestaurantId(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>가게 이름 (상호명)</FormLabel>
                <Input
                  placeholder="상호명 입력"
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>가게 전화번호</FormLabel>
              <Input
                placeholder="전화번호 입력"
                onChange={(e) => setRestaurantTel(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>가게 주소</FormLabel>
              <Input value={address} readOnly />
              <PostCode onSelectAddress={handleSelectAddress} />
            </FormControl>

            <FormControl>
              <FormLabel>카테고리 선택</FormLabel>
              <Select
                placeholder="카테고리 선택"
                onChange={(e) => setCategoryName(e.target.value)}
              >
                <option value="1">한식</option>
                <option value="2">중식</option>
                <option value="3">일식</option>
                <option value="4">분식</option>
                <option value="5">양식</option>
                <option value="6">치킨</option>
                <option value="7">아시아음식</option>
                <option value="8">버거</option>
                <option value="9">카페</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>로고 등록</FormLabel>
              <Box mt={"30px"}>
                <Image boxSize={"180px"} src={filePreview} />
              </Box>
              <Input type="file" accept="image/*" onChange={handleChangeLogo} />
            </FormControl>
          </VStack>
        </Box>

        <Button
          colorScheme="blue"
          size="lg"
          width="100%"
          onClick={handleRegisterRestaurant}
        >
          다음
        </Button>
      </VStack>
    </Container>
  );
}

export default RegisterRestaurant;
