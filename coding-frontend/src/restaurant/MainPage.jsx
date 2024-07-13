import {Box, Center, Grid, GridItem, Image, Text} from "@chakra-ui/react";

// 카테고리 이름 배열
const categories = [
    "한식",
    "중식",
    "일식",
    "분식",
    "양식",
    "치킨",
    "피자",
    "족발 • 보쌈",
    "버거",
    "카페",
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

    return (
        <Box p={4}>
            <Box mb={4} fontSize="2xl" fontWeight="bold">
                메인 페이지
            </Box>
            <Grid templateColumns="repeat(5, 1fr)" gap={16}>
                {images.map((imageUrl, index) => (
                    <GridItem key={index} colSpan={1}>
                        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md">
                            <Center p={4}>
                                <Image
                                    borderRadius="full"
                                    boxSize="150px"
                                    src={imageUrl}
                                    alt={`Image ${index}`}
                                    transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                                    _hover={{ transform: "scale(1.1)" }}
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
