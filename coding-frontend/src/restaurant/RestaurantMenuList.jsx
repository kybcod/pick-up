import {Box, Spinner, Text, VStack, Heading, SimpleGrid, Image} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function RestaurantMenuList() {
    const { placeId } = useParams();
    const [placeInfo, setPlaceInfo] = useState(null);

    useEffect(() => {
        axios.get(`/api/menus/${placeId}`)
            .then((res) => {
                console.log(res.data);
                setPlaceInfo(res.data);
            })
            .catch((err) => {
                console.error("실패", err);
            });
    }, []);

    if (placeInfo === null) {
        return <Spinner />;
    }

    return (
        <Box>
            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg">피드백 정보</Heading>
                    <SimpleGrid columns={2} spacing={2}>
                        <Text fontWeight="bold">평균 점수:</Text>
                        <Text>
                            {placeInfo.basicInfo.feedback.scorecnt > 0
                                ? (placeInfo.basicInfo.feedback.scoresum / placeInfo.basicInfo.feedback.scorecnt).toFixed(2)
                                : "평가 없음"}
                        </Text>
                    </SimpleGrid>
                </Box>

                <Box>
                    <Heading size="lg">메뉴 정보</Heading>
                    <Text>메뉴 개수: {placeInfo.menuInfo.menucount}</Text>
                    <VStack spacing={4} align="stretch">
                        {placeInfo.menuInfo.menuList.map((menu, index) => (
                            <Box key={index} borderWidth={1} borderRadius="lg" overflow="hidden" p={4}>
                                <Image src={menu.img}/>
                                <Text fontWeight="bold">{menu.menu}</Text>
                                <Text>{menu.price}</Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>

            </VStack>
        </Box>
    );
}