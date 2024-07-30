import {
  Box,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

const categories = [
  "한식",
  "중식",
  "일식",
  "분식",
  "양식",
  "치킨",
  "아시아음식",
  "패스트푸드",
  "카페",
];

export function MainPage() {
  const images = [
    "https://velog.velcdn.com/images/kpo12345/post/d586ced9-2b7b-4171-8cb6-11acdb32eb74/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/062b1534-8184-4c87-bbe8-7fca67ac5a19/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/d85b84d3-c389-496d-b936-1b21cf288183/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/cf9a4bf9-f1de-4b57-83eb-49a9ce01562e/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/a5fc3684-fbb9-4eee-9d91-f2f0e546216f/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/d1fb6dbe-ba0c-4bc9-971d-250e326d7d96/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/c04943de-20c0-40c2-8518-dbd9b1529906/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/d267ad5f-bef3-49b3-ac49-1aa8a807b3b6/image.png",
    "https://velog.velcdn.com/images/kpo12345/post/09fba573-348d-4d72-8f9b-4b019047d1e7/image.png",
  ];

  const [currentAddress, setCurrentAddress] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const account = useContext(LoginContext);
  const userId = account.id;

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const savedPosition = localStorage.getItem(`currentPosition_${userId}`);
        if (savedPosition) {
          const { latitude, longitude } = JSON.parse(savedPosition);
          setCurrentPosition({ latitude, longitude });
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [userId]);

  useEffect(() => {
    if (account.isLoggedIn()) {
      if (currentPosition) {
        fetchAddressFromCoords(
          currentPosition.latitude,
          currentPosition.longitude,
        );
        localStorage.setItem(
          `currentPosition_${userId}`,
          JSON.stringify(currentPosition),
        );
      }
    } else {
      localStorage.removeItem(`currentPosition_${userId}`);
    }
  }, [currentPosition, userId]);

  const fetchAddressFromCoords = (latitude, longitude) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(latitude, longitude);

    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        if (result[0]) {
          const roadAddress = result[0].road_address?.address_name;
          const jibunAddress = result[0].address.address_name;
          if (roadAddress === undefined || roadAddress === null) {
            setCurrentAddress(jibunAddress);
          } else {
            setCurrentAddress(roadAddress + jibunAddress);
          }
        }
      } else {
        console.error("Failed to fetch address:", status);
      }
    });
  };

  const handleGetCurrentLocation = () => {
    if (!account.isLoggedIn()) {
      alert("로그인 해주세요.");
      navigate("/login");
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setCurrentPosition({ latitude, longitude });
          },
          (error) => console.error("Error getting current location:", error),
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  };

  const handleCategoryClick = (index) => {
    if (currentPosition) {
      navigate(`/restaurant/${index + 1}`, {
        state: {
          currentPosition,
          currentAddress,
          categoryImage: images[index],
        },
      });
    } else {
      alert("먼저 현재 위치를 가져와주세요.");
    }
  };

  return (
    <Box bg="gray.100" minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" color="#2AC1BC" textAlign="center" mb={4}>
            픽업 주문
          </Heading>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <Flex align="center">
                <Box display={"inline-block"} whiteSpace={"nowrap"}>
                  <Text fontSize="lg" fontWeight="bold" mr={4}>
                    현 위치
                  </Text>
                </Box>
                <InputGroup size="lg">
                  <Input
                    readOnly
                    value={currentAddress}
                    placeholder="현재 위치를 설정해주세요"
                    bg="gray.100"
                  />
                  <InputRightAddon
                    children={<FontAwesomeIcon icon={faLocationCrosshairs} />}
                    cursor="pointer"
                    onClick={handleGetCurrentLocation}
                    bg="#2AC1BC"
                    color="white"
                  />
                </InputGroup>
              </Flex>
            </VStack>
          </Box>

          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {images.map((imageUrl, index) => (
              <GridItem key={index} onClick={() => handleCategoryClick(index)}>
                <Box
                  bg="white"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                >
                  <Center p={4}>
                    <Image
                      borderRadius="full"
                      boxSize="120px"
                      src={imageUrl}
                      objectFit="cover"
                    />
                  </Center>
                  <Box p={4} textAlign="center">
                    <Text fontSize="lg" fontWeight="bold" color="#333">
                      {categories[index]}
                    </Text>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
