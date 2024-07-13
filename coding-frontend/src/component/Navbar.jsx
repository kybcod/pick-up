import {Box, Center, Flex, Image} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export function Navbar() {
    const navigate = useNavigate();
    return (
        <Flex h={"55px"} cursor={"pointer"} backgroundColor={"#2AC1BC"}>
            <Box>
                <Box cursor={"pointer"} w={"200px"} onClick={() => navigate("/")}>
                    <Image src={"/img/pickUp_black.png"} />
                </Box>
            </Box>

            <Center onClick={()=>navigate("restaurant")}>
                지도
            </Center>
            <Center>
                login
            </Center>
        </Flex>
    );
}