import React, {useEffect, useState} from "react";
import {CustomOverlayMap, Map, MapMarker} from "react-kakao-maps-sdk";
import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    Text,
    VStack,
} from "@chakra-ui/react";
import {RestaurantList} from "./RestaurantList.jsx";
import {useLocation} from "react-router-dom";
import axios from "axios";

export default function RestaurantMapView() {
    const apiKey = import.meta.env.VITE_API_KEY;
    const [map, setMap] = useState(null);
    const [foodMarkers, setFoodMarkers] = useState([]);
    const [cafeMarkers, setCafeMarkers] = useState([]);
    const [info, setInfo] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [category, setCategory] = useState(null);

    const location = useLocation();
    const {currentPosition, currentAddress} = location.state || {};

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(
                        currentPosition.latitude,
                        currentPosition.longitude,
                    ),
                    level: 3,
                };

                const newMap = new window.kakao.maps.Map(mapContainer, options);
                setMap(newMap);

            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);


    useEffect(() => {
        if (map && currentPosition) {
            searchNearbyPlaces(currentPosition.latitude, currentPosition.longitude);
        }
    }, [map]);

    const searchNearbyPlaces = (latitude, longitude) => {
        if (!window.kakao || !window.kakao.maps) return;

        const ps = new window.kakao.maps.services.Places();
        axios.get(`/api/restaurants/5`)
            .then((res) => {
                console.log(res.data);
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
                                    const filtered = placesAccumulator.filter(item => {
                                        const categoryParts = item.category_name.split('>');
                                        return categoryParts.length > 1 && categoryParts[1].trim() === categoryName;
                                    });
                                    displayPlacesOnMap(filtered, groupCode);
                                }
                            } else {
                                console.error("Failed to fetch places:", status);
                            }
                        },
                        {location: new window.kakao.maps.LatLng(latitude, longitude)},
                    );
                };
                searchPlaces();
            })
            .catch((reason) => console.log("실패 " + reason));

        // const categories = ["FD6", "CE7"];
        // categries
        // id - increment
        // name - 일식
        // groupCode - FD6

        //category.forEach((categoryCode) => {
    };

    const displayPlacesOnMap = (places, categoryCode) => {
        const markersArray = places.map((place) => ({
            position: {lat: place.y, lng: place.x},
            content: place.place_name,
            place: place,
        }));

        if (categoryCode === "FD6") {
            setFoodMarkers(markersArray);
        } else if (categoryCode === "CE7") {
            setCafeMarkers(markersArray);
        }
        console.log(places);
        // 데이터베이스에 저장하는 로직
        // savePlacesToDatabase(places);
    };

    const savePlacesToDatabase = (places) => {
        // places 배열의 각 요소를 데이터베이스에 저장하는 로직
        places.forEach((place) => {
            axios
                .post("/api/restaurants", {
                    restaurantId: place.id,
                    restaurantName: place.place_name,
                    restaurantNumber: place.phone,
                    address: place.road_address_name || place.address_name,
                })
                .then((response) => {
                    console.log("가게 저장 성공 ", response.data);
                })
                .catch((error) => {
                    console.error("가게 저장 실패", error);
                });
        });
    };

    const handleShowFoodMarkers = () => {
        setInfo(null);
        setSelectedRestaurant(null);
        setFoodMarkers((prev) =>
            prev.map((marker) => ({...marker, visible: true})),
        );
        setCafeMarkers((prev) =>
            prev.map((marker) => ({...marker, visible: false})),
        );
    };

    const handleShowCafeMarkers = () => {
        setInfo(null);
        setSelectedRestaurant(null);
        setFoodMarkers((prev) =>
            prev.map((marker) => ({...marker, visible: false})),
        );
        setCafeMarkers((prev) =>
            prev.map((marker) => ({...marker, visible: true})),
        );
    };

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

    const allRestaurants = [...foodMarkers, ...cafeMarkers].filter(
        (r) => r.visible !== false,
    );

    return (
        <Flex>
            <Box width="30%" mr={4}>
                <Heading size="md" mb={4}>
                    식당 및 카페 목록
                </Heading>
                <Text mb={4}>현재 주소: {currentAddress}</Text>
                <Button onClick={handleShowFoodMarkers} mr={2} mb={4}>
                    <Text role="img" aria-label="Food">
                        🌮
                    </Text>{" "}
                    음식점
                </Button>
                <Button onClick={handleShowCafeMarkers} mb={4}>
                    <Text role="img" aria-label="Cafe">
                        ☕
                    </Text>{" "}
                    카페
                </Button>
                <RestaurantList
                    restaurants={allRestaurants}
                    onRestaurantClick={handleRestaurantClick}
                />
            </Box>
            <Box width="70%">
                <Box id="map" style={{width: "100%", height: "400px"}}>
                    {map && (
                        <Map
                            center={{
                                lat: currentPosition.latitude,
                                lng: currentPosition.longitude,
                            }}
                            style={{width: "100%", height: "100%"}}
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
                                    size: {width: 35, height: 35},
                                    options: {offset: {x: 20, y: 40}},
                                }}
                            />
                            {selectedRestaurant ? (
                                <MapMarker
                                    position={selectedRestaurant.position}
                                    image={{
                                        src:
                                            selectedRestaurant.place.category_group_code === "FD6"
                                                ? "/img/restaurant.png"
                                                : "/img/cafe.png",
                                        size: {width: 30, height: 30},
                                    }}
                                    onClick={() => setInfo(selectedRestaurant)}
                                />
                            ) : (
                                <>
                                    {foodMarkers
                                        .filter((marker) => marker.visible !== false)
                                        .map((marker, index) => (
                                            <MapMarker
                                                key={`food-${index}`}
                                                position={marker.position}
                                                image={{
                                                    src: "/img/restaurant.png",
                                                    size: {width: 30, height: 30},
                                                }}
                                                onClick={() => {
                                                    setInfo(marker);
                                                }}
                                            />
                                        ))}
                                    {cafeMarkers
                                        .filter((marker) => marker.visible !== false)
                                        .map((marker, index) => (
                                            <MapMarker
                                                key={`cafe-${index}`}
                                                position={marker.position}
                                                image={{
                                                    src: "/img/cafe.png",
                                                    size: {width: 30, height: 30},
                                                }}
                                                onClick={() => {
                                                    setInfo(marker);
                                                }}
                                            />
                                        ))}
                                </>
                            )}
                            {info && (
                                <CustomOverlayMap position={info.position} yAnchor={1.4}>
                                    <Popover isOpen={true} placement="bottom">
                                        <PopoverContent
                                            outline="none"
                                            _focus={{boxShadow: "none"}}
                                            bg="white"
                                            p={4}
                                            borderRadius="md"
                                            boxShadow="md"
                                            w={"auto"}
                                            minWidth="200px"
                                        >
                                            <PopoverArrow/>
                                            <PopoverCloseButton onClick={() => setInfo(null)}/>
                                            <PopoverBody padding="2">
                                                <VStack spacing={2} align="stretch">
                                                    <Link
                                                        href={info.place.place_url}
                                                        isExternal
                                                        fontWeight="bold"
                                                        fontSize="md"
                                                        color="teal.500"
                                                        _hover={{textDecoration: "underline"}}
                                                        whiteSpace="nowrap"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                    >
                                                        {info.content}
                                                    </Link>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                        whiteSpace="nowrap"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                    >
                                                        {info.place.road_address_name ||
                                                            info.place.address_name}
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
    );
}
