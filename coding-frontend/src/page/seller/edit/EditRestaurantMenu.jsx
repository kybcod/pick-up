import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Image, Input, VStack } from "@chakra-ui/react";
import axios from "axios";

function EditRestaurantMenu({ onSubmit, restaurantId }) {
  const [menuItems, setMenuItems] = useState([
    { img: "", name: "", price: "" },
  ]);
  const [filePreviews, setFilePreviews] = useState([""]);
  const fileInputRefs = useRef([]);
  const placeId = restaurantId;

  useEffect(() => {
    axios.get(`/api/menus/${placeId}`).then((response) => {
      const data = response.data;
      console.log("get 요청 메뉴 :", data);

      if (data.menuInfo && Array.isArray(data.menuInfo.menuList)) {
        const menuList = data.menuInfo.menuList;
        const formattedMenuItems = menuList.map((item) => ({
          img: item.img,
          name: item.menu,
          price: item.price,
        }));

        setMenuItems(formattedMenuItems);
        setFilePreviews(formattedMenuItems.map((item) => item.img || ""));
      }
    });
  }, [restaurantId]);

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
    setMenuItems([...menuItems, { img: "", name: "", price: "" }]);
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
    formData.append("restaurantId", restaurantId);

    menuItems.forEach((item, index) => {
      formData.append(`menuItems[${index}].name`, item.name);
      formData.append(`menuItems[${index}].price`, item.price);
      if (item.img instanceof File) {
        formData.append(`menuItems[${index}].img`, item.img);
      } else if (typeof item.img === "string") {
        formData.append(`menuItems[${index}].imgUrl`, item.img);
      }
    });

    // FormData의 키와 값을 로그로 찍기
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    axios
      .putForm(`/api/menus/seller`, formData)
      .then(() => {
        alert("메뉴 수정 성공!");
        onSubmit();
      })
      .catch((error) => {
        console.error("메뉴 수정 실패:", error);
      });
  };

  return (
    <Box>
      <VStack spacing={4}>
        {Array.isArray(menuItems) ? (
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
            >
              <Image height="180px" src={filePreviews[index] || item.img} />
              <Input
                type="file"
                accept={"image/*"}
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
          ))
        ) : (
          <Box>메뉴가 없습니다.</Box>
        )}
        <Button colorScheme="blue" onClick={handleFormSubmit}>
          수정
        </Button>
      </VStack>
    </Box>
  );
}

export default EditRestaurantMenu;
