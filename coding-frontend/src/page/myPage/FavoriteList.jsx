import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function FavoriteList() {
  const [likeRestaurantList, setLikeRestaurantList] = useState(null);
  const [menuInfo, setMenuInfo] = useState(null);
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const userId = account.id;

  useEffect(() => {
    axios.get(`/api/favorites/${userId}`).then((res) => {
      setLikeRestaurantList(res.data);

      const favoriteIds = res.data.map((favorite) => favorite.restaurantId);

      const menuPromises = favoriteIds.map((placeId) =>
        axios.get(`/api/menus/${placeId}`),
      );

      Promise.all(menuPromises)
        .then((responses) => {
          const menuInfos = responses.map((response) => response.data);
          setMenuInfo(menuInfos);
          console.log(menuInfos);
        })
        .catch((error) => {
          console.error("메뉴 정보를 가져오는 중 오류 발생:", error);
        });
    });
  }, [userId]);

  if (likeRestaurantList === null || menuInfo === null) {
    return <Spinner />;
  }

  return (
    <Box p={5}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {menuInfo.map((restaurant, index) => (
          <Box
            key={index}
            onClick={() => navigate(`/menu/${restaurant.basicInfo.cid}`)}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            cursor="pointer"
          >
            <Image
              src={restaurant.basicInfo.mainphotourl}
              alt={restaurant.basicInfo.placenamefull}
              height="200px"
              width="100%"
              objectFit="cover"
            />
            <VStack align="start" p={4} spacing={2}>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                {restaurant.basicInfo.placenamefull}
              </Text>
              <HStack>
                <Badge colorScheme="green">
                  {restaurant.basicInfo.category.catename}
                </Badge>
                <Badge colorScheme="blue">
                  {restaurant.basicInfo.category.cate1name}
                </Badge>
              </HStack>
              <HStack>
                <FontAwesomeIcon icon={faStar} color="#FFD43B" />
                <Text>
                  {(
                    restaurant.basicInfo.feedback.scoresum /
                    restaurant.basicInfo.feedback.scorecnt
                  ).toFixed(1)}
                  {` (${restaurant.basicInfo.feedback.scorecnt})`}
                </Text>
              </HStack>
              <HStack>
                <FontAwesomeIcon icon={faPhoneAlt} color="green.500" />
                <Text>{restaurant.basicInfo.phonenum}</Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default FavoriteList;
