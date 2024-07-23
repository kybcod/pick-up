import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MenuList } from "./MenuList.jsx";
import { SelectedMenuList } from "./SelectedMenuList.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function RestaurantMenuList() {
  const { placeId } = useParams();
  const [placeInfo, setPlaceInfo] = useState(null);
  const [cart, setCart] = useState({});
  const account = useContext(LoginContext);
  const userId = account.id;

  useEffect(() => {
    axios
      .get(`/api/menus/${placeId}`)
      .then((res) => {
        console.log(res.data);
        setPlaceInfo(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch menu data", err);
      });

    axios
      .get(`/api/carts/${userId}/${placeId}`)
      .then((res) => {
        const cartData = res.data.reduce((acc, item) => {
          acc[item.menuName] = {
            menu: item.menuName,
            price: item.menuPrice,
            count: item.menuCount,
          };
          return acc;
        }, {});
        setCart(cartData);
      })
      .catch((err) => {
        console.error("Failed to fetch cart data", err);
      });
  }, [placeId]);

  const handleRemove = (menu) => {
    setCart((preCart) => {
      const newCart = { ...preCart };
      if (newCart[menu.menu] && newCart[menu.menu].count > 0) {
        newCart[menu.menu].count -= 1;
        if (newCart[menu.menu].count === 0) {
          delete newCart[menu.menu];
        }
      }
      return newCart;
    });
  };

  const handleAdd = (menu) => {
    setCart((preCart) => {
      const newCart = { ...preCart };
      if (newCart[menu.menu]) {
        newCart[menu.menu].count += 1;
      } else {
        newCart[menu.menu] = { ...menu, count: 1 };
      }
      return newCart;
    });
  };

  const handleReset = (menu) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[menu.menu]) {
        newCart[menu.menu].count = 0;
        delete newCart[menu.menu];
      }
      return newCart;
    });

    const menuName = menu.menu;

    axios
      .delete(`/api/carts/${userId}/${placeId}/${menuName}`)
      .then((res) => console.log("삭제 성공"));
  };

  if (placeInfo === null) {
    return <Spinner />;
  }

  return (
    <Box bg="gray.50" minHeight="100vh">
      <Box bg="#2AC1BC" py={6} mb={6}>
        <Container maxW="container.xl">
          <Heading size="xl" color="white">
            {placeInfo.basicInfo.placenamefull}
          </Heading>
        </Container>
      </Box>
      <Container maxW="container.xl">
        <Box
          mb={6}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          maxWidth="100%"
          height="300px"
        >
          <Image
            src={placeInfo.basicInfo.mainphotourl}
            alt={placeInfo.basicInfo.placenamefull}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
        <Flex
          spacing={6}
          align="flex-start"
          justifyContent="space-between"
          flexDir={["column", "column", "row"]}
        >
          <Box
            flex="1"
            mr={[0, 0, 6]}
            mb={[6, 6, 0]}
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={4} align="stretch">
              <MenuList
                menuList={placeInfo.menuInfo.menuList}
                cart={cart}
                handleAdd={handleAdd}
                handleRemove={handleRemove}
              />
            </VStack>
          </Box>
          <Box
            flex="0 0 350px"
            position={["static", "static", "sticky"]}
            top="20px"
            maxHeight={["auto", "auto", "calc(100vh - 150px)"]}
            overflowY="auto"
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
          >
            <SelectedMenuList
              cart={cart}
              menuList={placeInfo.menuInfo.menuList}
              placeId={placeId}
              handleReset={handleReset}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
