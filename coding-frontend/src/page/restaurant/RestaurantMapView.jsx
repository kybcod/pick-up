import React, {useEffect, useState} from "react";
import {CustomOverlayMap, Map, MapMarker} from "react-kakao-maps-sdk";
import {
    Box,
    Flex,
    Heading,
    Link,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    Text,
    useColorModeValue,
    VStack
} from "@chakra-ui/react";
import {RestaurantList} from "./RestaurantList.jsx";
import {useLocation, useParams} from "react-router-dom";
import axios from "axios";

export default function RestaurantMapView() {
    const apiKey = import.meta.env.VITE_API_KEY;
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [info, setInfo] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [category, setCategory] = useState(null);
    const {categoryId} = useParams();

    const location = useLocation();
    const {currentPosition, currentAddress, categoryImage} = location.state || {};

    const bgColor = useColorModeValue("white", "gray.800");
    const mapContainerStyle = useColorModeValue({width: "100%", height: "400px"}, {
        width: "100%",
        height: "400px",
        bg: "gray.900"
    });
    const mapMarkerStyle = useColorModeValue({width: 50, height: 50}, {width: 50, height: 50});

    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById("map");
                const options = {
                    center: new window.kakao.maps.LatLng(currentPosition.latitude, currentPosition.longitude),
                    level: 3,
                };

                const newMap = new window.kakao.maps.Map(mapContainer, options);
                setMap(newMap);
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

    const searchNearbyPlaces = (latitude, longitude) => {
        if (!window.kakao || !window.kakao.maps) return;

        const ps = new window.kakao.maps.services.Places();
        axios.get(`/api/restaurants/${categoryId}`)
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
    };

    const displayPlacesOnMap = (places, categoryCode) => {
        const markersArray = places.map((place) => ({
            position: {lat: place.y, lng: place.x},
            content: place.place_name,
            place: place,
            imageUrl: categoryImage
        }));

        setMarkers(markersArray);
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

    return (
        <Box>
            <Heading size="md" mb={4} color="teal.500">
                식당 및 카페 목록
            </Heading>
            <Text mb={4}>현재 주소: {currentAddress}</Text>
            <Flex direction="row" h="100vh">
                <Box width="30%" mr={4} bg={bgColor} p={4} boxShadow="md" borderRadius="md">
                    <RestaurantList
                        restaurants={markers}
                        onRestaurantClick={handleRestaurantClick}
                    />
                </Box>
                <Box width="70%" bg={bgColor} p={4} boxShadow="md" borderRadius="md" height={"100%"}>
                    <Box id="map" style={mapContainerStyle}>
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
                                        size: mapMarkerStyle,
                                        options: {offset: {x: 20, y: 40}},
                                    }}
                                />
                                {markers.map((marker, index) => (
                                    <MapMarker
                                        key={`marker-${index}`}
                                        position={marker.position}
                                        image={{
                                            src: marker.imageUrl,
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
        </Box>
    );
}
