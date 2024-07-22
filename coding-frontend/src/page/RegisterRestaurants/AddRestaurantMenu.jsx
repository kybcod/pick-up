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
    console.log(updatedItems);

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
    const menuData = menuItems.map((item) => ({
      name: item.name,
      price: item.price,
      files: item.img,
    }));

    const payload = {
      restaurantId: restaurantData.restaurantId,
      menuItems: menuData,
    };

    axios
      .post("/api/menus", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
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
              mr={2}
              onChange={(e) => handleImageChange(e, index)}
              ref={(el) => (fileInputRefs.current[index] = el)}
            />
            <Input
              placeholder="제품명"
              value={item.name}
              onChange={(e) => handleChange(e, index, "name")}
              mr={2}
            />
            <Input
              type="number"
              placeholder="가격"
              value={item.price}
              onChange={(e) => handleChange(e, index, "price")}
              mr={2}
            />
            <Button colorScheme="purple" onClick={() => handleRemove(index)}>
              -
            </Button>
            {index === menuItems.length - 1 && (
              <Button colorScheme="purple" onClick={handleAdd}>
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
