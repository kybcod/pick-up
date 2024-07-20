import {Box, Center, Grid, GridItem, Image, Input, InputGroup, InputRightAddon, Text} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationCrosshairs, faSearch} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const categories = [
    "한식", "중식", "일식", "분식", "양식",
    "치킨", "아시아음식", "족발 • 보쌈", "패스트푸드", "카페",
];

export function MainPage() {
    const images = [
        "https://velog.velcdn.com/images/kpo12345/post/d586ced9-2b7b-4171-8cb6-11acdb32eb74/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/062b1534-8184-4c87-bbe8-7fca67ac5a19/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/d85b84d3-c389-496d-b936-1b21cf288183/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/cf9a4bf9-f1de-4b57-83eb-49a9ce01562e/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/c04943de-20c0-40c2-8518-dbd9b1529906/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/d1fb6dbe-ba0c-4bc9-971d-250e326d7d96/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/a5fc3684-fbb9-4eee-9d91-f2f0e546216f/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/e4c5f6f4-c2bb-4c16-85ab-ede4e98c2efa/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/d267ad5f-bef3-49b3-ac49-1aa8a807b3b6/image.png",
        "https://velog.velcdn.com/images/kpo12345/post/09fba573-348d-4d72-8f9b-4b019047d1e7/image.png",
    ];

    const [currentAddress, setCurrentAddress] = useState("");
    const [currentPosition, setCurrentPosition] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Initialize Kakao Maps API
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_API_KEY}&autoload=false&libraries=services`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                // Restore position from localStorage if available
                const savedPosition = localStorage.getItem('currentPosition');
                if (savedPosition) {
                    const {latitude, longitude} = JSON.parse(savedPosition);
                    setCurrentPosition({latitude, longitude});
                }
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (currentPosition) {
            fetchAddressFromCoords(currentPosition.latitude, currentPosition.longitude);
            // Save position to localStorage
            localStorage.setItem('currentPosition', JSON.stringify(currentPosition));
        }
    }, [currentPosition]);

    const fetchAddressFromCoords = (latitude, longitude) => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const coord = new window.kakao.maps.LatLng(latitude, longitude);

        geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                if (result[0]) {
                    const roadAddress = result[0].road_address?.address_name;
                    const jibunAddress = result[0].address.address_name;
                    setCurrentAddress(roadAddress || jibunAddress);
                }
            } else {
                console.error("Failed to fetch address:", status);
            }
        });
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setCurrentPosition({latitude, longitude});
                },
                (error) => console.error("Error getting current location:", error)
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const handleCategoryClick = (index) => {
        if (currentPosition) {
            navigate(`/restaurant/${index + 1}`, {
                state: {
                    currentPosition,
                    currentAddress,
                    categoryImage: images[index]
                }
            });
        } else {
            alert("먼저 현재 위치를 가져와주세요.");
        }
    };

    const handleSearchClick = () => {
        // 검색 버튼 클릭 시 수행할 동작 추가
    };

    return (
        <Box p={4}>
            <Box mb={4} fontSize="2xl" fontWeight="bold">
                메인 페이지
            </Box>
            <InputGroup>
                <Text>현 위치 </Text>
                <Input readOnly value={currentAddress} placeholder={"현 위치"}/>
                <InputRightAddon onClick={handleGetCurrentLocation}>
                    <FontAwesomeIcon icon={faLocationCrosshairs}/>
                </InputRightAddon>
            </InputGroup>
            <InputGroup>
                <Text>가게 이름 </Text>
                <Input type='tel' placeholder='상점명'/>
                <InputRightAddon onClick={handleSearchClick}>
                    <FontAwesomeIcon icon={faSearch}/>
                </InputRightAddon>
            </InputGroup>
            <Grid templateColumns="repeat(5, 1fr)" gap={16}>
                {images.map((imageUrl, index) => (
                    <GridItem key={index} colSpan={1} onClick={() => handleCategoryClick(index)}>
                        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md">
                            <Center p={4}>
                                <Image
                                    borderRadius="full"
                                    boxSize="150px"
                                    src={imageUrl}
                                    transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                                    _hover={{transform: "scale(1.1)"}}
                                />
                            </Center>
                            <Box p={4} textAlign="center">
                                <Text fontSize="xl" fontWeight="bold">{categories[index]}</Text>
                            </Box>
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
}
