import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
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
    "https://velog.velcdn.com/images/kpo12345/post/79c5415c-4c0a-4583-9f4d-835887d787c2/image.png",
  ];

  const [currentAddress, setCurrentAddress] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);
  const navigate = useNavigate();
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
          fetchAddressFromCoords(latitude, longitude); // Ensure fetchAddressFromCoords is called here
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
  }, [currentPosition, userId, account]);

  const fetchAddressFromCoords = (latitude, longitude) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("Kakao Maps API is not available.");
      return;
    }

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
            setCurrentAddress(roadAddress + " " + jibunAddress);
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
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box
            bg="teal.500"
            color="white"
            p={6}
            borderRadius="xl"
            boxShadow="md"
          >
            <Heading as="h1" size="xl" textAlign="center" mb={4}>
              픽업 주문
            </Heading>
            <Text fontSize="lg" textAlign="center">
              맛있는 음식을 픽업으로 즐겨보세요!
            </Text>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <Flex align="center">
                <Text fontSize="md" fontWeight="bold" mr={2}>
                  현재 위치:
                </Text>
                <Text fontSize="md" flex={1}>
                  {currentAddress || "위치를 설정해주세요"}
                </Text>
                <Box
                  as="button"
                  onClick={handleGetCurrentLocation}
                  bg="#2AC1BC"
                  color="white"
                  px={3}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                >
                  <FontAwesomeIcon icon={faLocationCrosshairs} /> 현재 위치
                </Box>
              </Flex>
            </VStack>
          </Box>
          <Grid templateColumns={["repeat(2, 1fr)", "repeat(5, 1fr)"]} gap={6}>
            {images.map((imageUrl, index) => (
              <GridItem key={index} onClick={() => handleCategoryClick(index)}>
                {index < 9 ? (
                  <Box
                    bg="white"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="lg"
                    transition="all 0.3s"
                  >
                    <Box position="relative" pb="60%" overflow="hidden">
                      <Image
                        src={imageUrl}
                        alt={categories[index]}
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="100%"
                        h="100%"
                        _hover={{
                          transform: "translate(-50%, -50%) scale(1.1)",
                        }}
                      />
                    </Box>
                    <Box
                      p={2}
                      textAlign="center"
                      bg="rgba(255,255,255,0.9)"
                      borderTop="2px solid"
                      borderTopColor="teal.500"
                    >
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        {categories[index]}
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Box position="relative" pb="100%">
                    <Image
                      src={imageUrl}
                      position="absolute"
                      top="0"
                      left="0"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  </Box>
                )}
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
