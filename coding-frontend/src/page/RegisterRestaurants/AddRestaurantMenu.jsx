import React, { useState } from "react";
import { Box, Button, Input, VStack } from "@chakra-ui/react";

function AddRestaurantMenu({ onSubmit }) {
  const [menuItems, setMenuItems] = useState([{ name: "", price: 0 }]);

  const handleChange = (e, index, key) => {
    const updatedItems = [...menuItems];
    updatedItems[index][key] = e.target.value;
    setMenuItems(updatedItems);
  };

  const handleAdd = () => {
    setMenuItems([...menuItems, { img: "", name: "", price: 0 }]);
  };

  const handleRemove = (index) => {
    if (index > 0) {
      const updatedItems = menuItems.filter((_, i) => i !== index);
      setMenuItems(updatedItems);
    }
  };

  function handleFormSubmit() {}

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
            <Input
              type="file"
              mr={2}
              value={item.img}
              onChange={(e) => handleChange(e, index, "img")}
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
            <Button colorScheme="purple" onClick={handleAdd}>
              +
            </Button>
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
