import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { RestaurantList } from "./RestaurantList.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function RestaurantMapView() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [info, setInfo] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [category, setCategory] = useState(null);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [restaurantsDb, setRestaurantsDb] = useState(null);
  const [combinedRestaurants, setCombinedRestaurants] = useState([]);

  const location = useLocation();
  const { currentPosition, currentAddress, categoryImage } =
    location.state || {};
  const bgColor = useColorModeValue("white", "gray.800");
  const mapContainerStyle = useColorModeValue(
    { width: "100%", height: "100%" },
    {
      width: "100%",
      height: "100%",
      bg: "gray.900",
    },
  );
  const mapMarkerStyle = useColorModeValue(
    { width: 50, height: 50 },
    { width: 50, height: 50 },
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setTimeout(() => {
          const mapContainer = document.getElementById("map");
          if (mapContainer) {
            const options = {
              center: new window.kakao.maps.LatLng(
                currentPosition.latitude,
                currentPosition.longitude,
              ),
              level: 3,
            };

            const newMap = new window.kakao.maps.Map(mapContainer, options);
            setMap(newMap);
          }
        }, 500); // 100ms 지연
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey, currentPosition]);

  useEffect(() => {
    if (map && currentPosition) {
      searchNearbyPlaces(currentPosition.latitude, currentPosition.longitude);
    }
  }, [map, currentPosition]);

  useEffect(() => {
    axios.get("/api/restaurants").then((res) => {
      console.log("restDB", res.data);
      setRestaurantsDb(res.data);
    });
  }, []);

  const searchNearbyPlaces = (latitude, longitude) => {
    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();
    axios.get(`/api/restaurants/category/${categoryId}`).then((res) => {
      setCategory(res.data);
      let groupCode = res.data.groupCode;
      let categoryName = res.data.name;
      let placesAccumulator = [];
      const searchPlaces = (pagination) => {
        ps.categorySearch(
          groupCode,
          (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
              placesAccumulator = placesAccumulator.concat(data);
              if (pagination.hasNextPage) {
                pagination.nextPage();
              } else {
                const filtered = placesAccumulator.filter((item) => {
                  const categoryParts = item.category_name.split(">");
                  return (
                    categoryParts.length > 1 &&
                    categoryParts[1].trim() === categoryName
                  );
                });

                // restaurantsDb를 categoryId로 필터링
                const filteredRestaurantsDb = restaurantsDb.filter(
                  (restaurant) => restaurant.categoryId === categoryId,
                );

                // 외부 API 데이터와 DB 데이터를 결합
                const combinedPlaces = [
                  ...filtered.map((place) => ({
                    position: { lat: place.y, lng: place.x },
                    content: place.place_name,
                    place: {
                      ...place,
                      id: place.id,
                    },
                    markerImage: categoryImage,
                    listImage: categoryImage,
                    isFromApi: true,
                  })),
                  ...filteredRestaurantsDb.map((restaurant) => ({
                    position: {
                      lat: restaurant.latitude,
                      lng: restaurant.longitude,
                    },
                    content: restaurant.name,
                    place: {
                      id: restaurant.restaurantId,
                      place_name: restaurant.restaurantName,
                      address_name: restaurant.address,
                      phone: restaurant.restaurantTel,
                    },
                    markerImage: categoryImage,
                    listImage: restaurant.logo || categoryImage,
                    isFromDb: true,
                  })),
                ];

                setCombinedRestaurants(combinedPlaces);
                setMarkers(combinedPlaces);
              }
            } else {
              console.error("Failed to fetch places:", status);
            }
          },
          { location: new window.kakao.maps.LatLng(latitude, longitude) },
        );
      };
      searchPlaces();
    });
  };

  useEffect(() => {
    if (map && markers.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(
          new window.kakao.maps.LatLng(
            marker.position.lat,
            marker.position.lng,
          ),
        );
      });
      map.setBounds(bounds);
    }
  }, [map, markers]);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setInfo(restaurant);
    map.panTo(
      new window.kakao.maps.LatLng(
        restaurant.position.lat,
        restaurant.position.lng,
      ),
    );
  };

  if (restaurantsDb === null) {
    return <Spinner />;
  }

  return (
    <Container maxW="container.xl" p={0}>
      <Box bg="#2AC1BC" color="white" py={4} px={6} borderRadius="lg" mb={4}>
        <Heading size="lg">픽업</Heading>
        <Text mt={2}>현재 주소: {currentAddress}</Text>
      </Box>
      <Flex
        direction={["column", "column", "row"]}
        height={["auto", "auto", "calc(100vh - 100px)"]}
      >
        <Box
          width={["100%", "100%", "40%"]}
          mr={[0, 0, 4]}
          mb={[4, 4, 0]}
          bg={bgColor}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
        >
          <RestaurantList
            restaurants={combinedRestaurants.map((restaurant) => ({
              ...restaurant,
              imageUrl: restaurant.listImage, // listImage를 사용
            }))}
            onRestaurantClick={handleRestaurantClick}
          />
        </Box>
        <Box
          width={["100%", "100%", "60%"]}
          bg={bgColor}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          height={["400px", "400px", "100%"]}
        >
          <Box id="map" style={mapContainerStyle}>
            {map && currentPosition && (
              <Map
                center={{
                  lat: currentPosition.latitude,
                  lng: currentPosition.longitude,
                }}
                style={{ width: "100%", height: "100%" }}
                level={3}
                onCreate={setMap}
              >
                <MapMarker
                  position={{
                    lat: currentPosition.latitude,
                    lng: currentPosition.longitude,
                  }}
                  image={{
                    src: "/img/current.png",
                    size: mapMarkerStyle,
                    options: { offset: { x: 20, y: 40 } },
                  }}
                />
                {markers.map((marker, index) => (
                  <MapMarker
                    key={`marker-${index}`}
                    position={marker.position}
                    image={{
                      src: marker.markerImage,
                      size: mapMarkerStyle,
                    }}
                    onClick={() => {
                      setInfo(marker);
                    }}
                  />
                ))}
                {info && (
                  <CustomOverlayMap position={info.position} yAnchor={1.4}>
                    <Popover isOpen={true} placement="bottom">
                      <PopoverContent
                        outline="none"
                        _focus={{ boxShadow: "none" }}
                        bg="white"
                        p={4}
                        borderRadius="md"
                        boxShadow="md"
                        w="auto"
                        minWidth="200px"
                      >
                        <PopoverArrow />
                        <PopoverCloseButton onClick={() => setInfo(null)} />
                        <PopoverBody padding="2">
                          <VStack spacing={2} align="stretch">
                            <Link
                              onClick={() => navigate(`/menu/${info.place.id}`)}
                              fontWeight="bold"
                              fontSize="md"
                              color="teal.500"
                              _hover={{ textDecoration: "underline" }}
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {info.content || info.place.place_name}
                            </Link>
                            <Text
                              fontSize="xs"
                              color="gray.600"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {info.place.road_address_name
                                ? `${info.place.road_address_name} ${info.place.address_name || ""}`
                                : info.place.address_name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {info.place.phone}
                            </Text>
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </CustomOverlayMap>
                )}
              </Map>
            )}
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
