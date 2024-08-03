import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

function EditRestaurantMenu({ onSubmit, restaurantId }) {
  const [menuItems, setMenuItems] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [newFileList, setNewFileList] = useState([]);
  const [removeFileList, setRemoveFileList] = useState([]);
  const fileInputRefs = useRef([]);
  const placeId = restaurantId;
  const toast = useToast();

  useEffect(() => {
    axios.get(`/api/menus/list/${placeId}`).then((response) => {
      const data = response.data;
      setMenuItems(data);
      setFilePreviews(data.map((item) => item.img || ""));
    });
  }, [placeId]);

  const handleChange = (e, index, key) => {
    const updatedItems = [...menuItems];
    updatedItems[index][key] = e.target.value;
    setMenuItems(updatedItems);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    const updatedItems = [...menuItems];
    updatedItems[index].img = file;
    setMenuItems(updatedItems);

    const updatedPreviews = [...filePreviews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setFilePreviews(updatedPreviews);

    setNewFileList((prev) => [...prev, file]);
  };

  const handleAdd = () => {
    setMenuItems([...menuItems, { img: "", name: "", price: "" }]);
    setFilePreviews([...filePreviews, ""]);
  };

  const handleRemove = (index) => {
    if (menuItems.length > 1) {
      const removedItem = menuItems[index];
      const updatedItems = menuItems.filter((_, i) => i !== index);
      setMenuItems(updatedItems);

      const updatedPreviews = filePreviews.filter((_, i) => i !== index);
      setFilePreviews(updatedPreviews);

      if (removedItem.img && typeof removedItem.img === "string") {
        // 파일명 추출
        const fileName = removedItem.img.split("/").pop();
        setRemoveFileList((prev) => [...prev, fileName]);
      }

      if (removedItem.img instanceof File) {
        setNewFileList((prev) =>
          prev.filter((file) => file !== removedItem.img),
        );
      }

      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index].value = "";
      }
    }
  };

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId);

    menuItems.forEach((item, index) => {
      if (item.id !== undefined) {
        formData.append(`menuItems[${index}].id`, item.id);
      }
      formData.append(`menuItems[${index}].name`, item.name);
      formData.append(`menuItems[${index}].price`, item.price);
      if (typeof item.img === "string") {
        formData.append(`menuItems[${index}].existingImageUrl`, item.img);
      } else if (item.img instanceof File) {
        formData.append(`menuItems[${index}].img`, item.img);
      }
    });

    newFileList.forEach((file) => {
      formData.append("newFileList", file);
    });

    removeFileList.forEach((fileName) => {
      formData.append("removeFileList", fileName);
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    axios
      .putForm(`/api/menus/seller`, formData)
      .then(() => {
        toast({
          status: "success",
          description: "메뉴 수정되었습니다.",
          position: "top",
          duration: 3000,
        });
        onSubmit();
      })
      .catch((error) => {
        toast({
          status: "warning",
          description: "메뉴 실패하였습니다.",
          position: "top",
          duration: 3000,
        });
      });
  };

  const handleFileButtonClick = (index) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  return (
    <Box>
      <VStack spacing={4}>
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => (
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
              >
                {filePreviews[index] ? (
                  <Image height="180px" src={filePreviews[index]} />
                ) : (
                  <Box
                    height="180px"
                    width="150px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px dashed #ddd"
                    borderRadius="md"
                  >
                    <Text>이미지 없음</Text>
                  </Box>
                )}
                <Input
                  type="file"
                  accept="image/*"
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
              <Flex display="flex" justifyContent="center" ml={4} width="100%">
                <Input
                  placeholder="제품명"
                  value={item.name}
                  onChange={(e) => handleChange(e, index, "name")}
                  mr={2}
                  flex="1"
                />
                <InputGroup flex="1" mr={2}>
                  <Input
                    type="number"
                    placeholder="가격"
                    value={item.price}
                    onChange={(e) => handleChange(e, index, "price")}
                  />
                  <InputRightAddon>원</InputRightAddon>
                </InputGroup>
              </Flex>
              <Button
                colorScheme="teal"
                onClick={() => handleRemove(index)}
                mr={2}
              >
                -
              </Button>
              {index === menuItems.length - 1 && (
                <Button colorScheme="teal" onClick={handleAdd}>
                  +
                </Button>
              )}
            </Box>
          ))
        ) : (
          <Box>메뉴가 없습니다.</Box>
        )}
        <Button colorScheme="blue" onClick={handleFormSubmit}>
          메뉴 수정
        </Button>
      </VStack>
    </Box>
  );
}

export default EditRestaurantMenu;
