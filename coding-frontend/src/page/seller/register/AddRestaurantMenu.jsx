import React, { useRef, useState } from "react";
import { Box, Button, Image, Input, VStack } from "@chakra-ui/react";
import axios from "axios";

function AddRestaurantMenu({ onSubmit, restaurantData }) {
  const [menuItems, setMenuItems] = useState([
    { img: null, name: "", price: 0 },
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
    const updatedItems = [...menuItems];
    updatedItems[index].img = file;
    setMenuItems(updatedItems);

    const updatedPreviews = [...filePreviews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setFilePreviews(updatedPreviews);
  };

  const handleAdd = () => {
    setMenuItems([...menuItems, { img: null, name: "", price: 0 }]);
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
    formData.append("restaurantId", restaurantData.restaurantId); // Ensure restaurantId is passed

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
          >
            <Image height="180px" src={filePreviews[index]} />
            <Input
              type="file"
              accept={"image/*"}
              mr={2}
              onChange={(e) => handleImageChange(e, index)}
              ref={(el) => (fileInputRefs.current[index] = el)}
            />
            <Input
              placeholder="제품명"
              onChange={(e) => handleChange(e, index, "name")}
              mr={2}
            />
            <Input
              type="number"
              placeholder="가격"
              onChange={(e) => handleChange(e, index, "price")}
              mr={2}
            />
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
        ))}
        <Button colorScheme="blue" onClick={handleFormSubmit}>
          제출
        </Button>
      </VStack>
    </Box>
  );
}

export default AddRestaurantMenu;
