import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

function AddRestaurantMenu({ onSubmit, restaurantData }) {
  const [menuItems, setMenuItems] = useState([
    { img: null, name: "", price: "" },
  ]);
  const [filePreviews, setFilePreviews] = useState([""]);
  const fileInputRefs = useRef([]);

  const handleChange = (e, index, key) => {
    const updatedItems = [...menuItems];
    updatedItems[index][key] = e.target.value;
    setMenuItems(updatedItems);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return; // 파일이 없을 경우 처리

    const updatedItems = [...menuItems];
    updatedItems[index].img = file;
    setMenuItems(updatedItems);

    const updatedPreviews = [...filePreviews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setFilePreviews(updatedPreviews);
  };

  const handleFileButtonClick = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleAdd = () => {
    setMenuItems([...menuItems, { img: null, name: "", price: "" }]);
    setFilePreviews([...filePreviews, ""]);
  };

  const handleRemove = (index) => {
    if (menuItems.length > 1) {
      const updatedItems = menuItems.filter((_, i) => i !== index);
      setMenuItems(updatedItems);

      const updatedPreviews = filePreviews.filter((_, i) => i !== index);
      setFilePreviews(updatedPreviews);

      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index].value = "";
      }
    }
  };

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append("restaurantId", restaurantData.restaurantId);

    menuItems.forEach((item, index) => {
      formData.append(`menuItems[${index}].name`, item.name);
      formData.append(`menuItems[${index}].price`, item.price);
      if (item.img) {
        formData.append(`menuItems[${index}].img`, item.img);
      }
    });

    axios
      .postForm("/api/menus", formData)
      .then(() => {
        alert("메뉴 등록 성공!");
        onSubmit();
      })
      .catch((error) => {
        console.error("메뉴 등록 실패:", error);
      });
  };

  return (
    <Box>
      <VStack spacing={4}>
        {menuItems.map((item, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={4}
            p={4}
            border="1px solid #ddd"
            borderRadius="md"
            bg="gray.50"
            width="80%"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="300px"
              mr={2}
            >
              {filePreviews[index] ? (
                <Image
                  src={filePreviews[index]}
                  alt="Preview"
                  height="180px"
                  width="100%"
                  objectFit="cover"
                  mb={2}
                />
              ) : (
                <Box
                  height="180px"
                  width="100%"
                  border="1px dashed #ddd"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={2}
                >
                  <Text>이미지 미리보기</Text>
                </Box>
              )}
              <Input
                type="file"
                accept={"image/*"}
                onChange={(e) => handleImageChange(e, index)}
                ref={(el) => (fileInputRefs.current[index] = el)}
                style={{ display: "none" }}
              />
              <Button
                colorScheme="teal"
                onClick={() => handleFileButtonClick(index)}
                mt={2}
              >
                이미지 업로드
              </Button>
            </Box>
            <Box display="flex" width="100%" alignItems="center">
              <Input
                placeholder="제품명"
                value={item.name}
                onChange={(e) => handleChange(e, index, "name")}
                mr={2}
              />
              <InputGroup mr={2}>
                <Input
                  type="number"
                  placeholder="가격"
                  value={item.price}
                  onChange={(e) => handleChange(e, index, "price")}
                />
                <InputRightAddon>원</InputRightAddon>
              </InputGroup>
              <Button
                colorScheme="teal"
                onClick={() => handleRemove(index)}
                mr={1}
              >
                -
              </Button>
              {index === menuItems.length - 1 && (
                <Button colorScheme="teal" onClick={handleAdd}>
                  +
                </Button>
              )}
            </Box>
          </Box>
        ))}
        <Button colorScheme="blue" onClick={handleFormSubmit}>
          메뉴 등록
        </Button>
      </VStack>
    </Box>
  );
}

export default AddRestaurantMenu;
