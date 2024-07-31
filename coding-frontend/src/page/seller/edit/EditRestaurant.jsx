import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import PostCode from "../../myPage/PostCode.jsx";
import { LoginContext } from "../../../component/LoginProvider.jsx";

function EditRestaurant({ onSubmit, restaurantId }) {
  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantId1, setRestaurantId1] = useState("");
  const [restaurantId2, setRestaurantId2] = useState("");
  const [restaurantId3, setRestaurantId3] = useState("");
  const [filePreview, setFilePreview] = useState("/img/pickUp_black.png");
  const account = useContext(LoginContext);
  const inputFileRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/restaurants/${restaurantId}`).then((response) => {
      const data = response.data;
      console.log("get", data);
      setRestaurantData(data);
      setFilePreview(data.logo);
      const restaurantIdStr = String(data.restaurantId);
      setRestaurantId1(restaurantIdStr.slice(0, 3));
      setRestaurantId2(restaurantIdStr.slice(3, 5));
      setRestaurantId3(restaurantIdStr.slice(5, 10));
    });
  }, [restaurantId]);

  const handleUpdateRestaurant = () => {
    const newRestaurantId = parseInt(
      restaurantId1 + restaurantId2 + restaurantId3,
      10,
    );

    let newAddress = "";
    if (restaurantData.address === undefined) {
      newAddress = restaurantData.address1;
    } else if (restaurantData.address1 === undefined) {
      newAddress = restaurantData.address;
    } else {
      newAddress = restaurantData.address + " " + restaurantData.address1;
    }

    axios
      .putForm(`/api/restaurants`, {
        restaurantId: newRestaurantId,
        userId: account.id,
        restaurantName: restaurantData.restaurantName,
        restaurantTel: restaurantData.restaurantTel,
        address: newAddress,
        latitude: restaurantData.latitude,
        longitude: restaurantData.longitude,
        categoryId: restaurantData.categoryId,
        file: restaurantData.file,
      })
      .then(() => {
        alert("수정 성공");
        onSubmit();
      })
      .catch((error) => {
        console.error("Error updating restaurant:", error);
        alert("수정 실패");
      });
  };

  const handleSelectAddress = (selectedAddress, lat, lng) => {
    setRestaurantData((prev) => ({
      ...prev,
      address: selectedAddress,
      latitude: lat,
      longitude: lng,
    }));
  };

  const bgColor = useColorModeValue("gray.50", "gray.700");

  const handleChange = (e, key) => {
    setRestaurantData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleChangeLogo = (e) => {
    const fileView = e.target.files[0];
    console.log("fileView", fileView);
    setRestaurantData((prev) => ({
      ...prev,
      file: fileView,
    }));
    if (fileView) {
      setFilePreview(URL.createObjectURL(fileView));
    } else {
      setFilePreview(restaurantData.logo);
    }
  };

  const handleFileButtonClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="#2AC1BC">
          가게 수정
        </Heading>

        <Box bg="white" p={8} borderRadius="xl" boxShadow="lg">
          <VStack spacing={8}>
            <SimpleGrid columns={2} spacing={6} width="100%">
              <FormControl>
                <FormLabel fontWeight="bold">사업장 번호</FormLabel>
                <Flex>
                  <Input
                    type="number"
                    placeholder="3자리"
                    value={restaurantId1}
                    mr={2}
                    readOnly
                  />
                  <Text alignSelf="center" mx={2}>
                    -
                  </Text>
                  <Input
                    type="number"
                    placeholder="2자리"
                    value={restaurantId2}
                    mx={2}
                    readOnly
                  />
                  <Text alignSelf="center" mx={2}>
                    -
                  </Text>
                  <Input
                    type="number"
                    placeholder="5자리"
                    value={restaurantId3}
                    ml={2}
                    readOnly
                  />
                </Flex>
                <FormHelperText color={"gray"}>
                  수정할 수 없습니다.
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">가게 이름 (상호명)</FormLabel>
                <Input
                  placeholder="상호명 입력"
                  value={restaurantData.restaurantName}
                  onChange={(e) => handleChange(e, "restaurantName")}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontWeight="bold">가게 전화번호</FormLabel>
              <Input
                placeholder="전화번호 입력"
                value={restaurantData.restaurantTel}
                onChange={(e) => handleChange(e, "restaurantTel")}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">가게 주소</FormLabel>
              <InputGroup>
                <Input
                  value={restaurantData.address}
                  readOnly
                  placeholder={"도로명/지번 주소"}
                />
                <InputRightElement width="4.5rem">
                  <PostCode onSelectAddress={handleSelectAddress} />
                </InputRightElement>
              </InputGroup>
              <Input
                mt={2}
                placeholder={"상세주소"}
                value={restaurantData.address1}
                onChange={(e) => handleChange(e, "address1")}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">카테고리 선택</FormLabel>
              <Select
                placeholder="카테고리 선택"
                value={restaurantData.categoryId}
                onChange={(e) => handleChange(e, "categoryId")}
              >
                <option value="1">한식</option>
                <option value="2">중식</option>
                <option value="3">일식</option>
                <option value="4">분식</option>
                <option value="5">양식</option>
                <option value="6">치킨</option>
                <option value="7">아시아음식</option>
                <option value="8">패스트푸드</option>
                <option value="9">카페</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">로고 등록</FormLabel>
              <Flex direction="column" alignItems="center">
                <Box
                  mt={4}
                  mb={4}
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={4}
                >
                  <Image boxSize={"180px"} src={filePreview} />
                </Box>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleChangeLogo}
                  ref={inputFileRef}
                  style={{ display: "none" }}
                />
                <Button
                  colorScheme="teal"
                  onClick={handleFileButtonClick}
                  mt={2}
                >
                  로고 업로드
                </Button>
              </Flex>
            </FormControl>
          </VStack>
        </Box>

        <Button
          colorScheme="teal"
          bg="#2AC1BC"
          color="white"
          size="lg"
          width="100%"
          onClick={handleUpdateRestaurant}
          _hover={{ bg: "#219A95" }}
        >
          수정하기
        </Button>
      </VStack>
    </Container>
  );
}

export default EditRestaurant;
