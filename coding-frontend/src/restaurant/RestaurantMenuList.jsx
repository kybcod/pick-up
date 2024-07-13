import {Box, Image, Spinner, Text} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function RestaurantMenuList() {
    const { placeId } = useParams();
    const [menuList, setMenuList] = useState(null);

    useEffect(() => {
            axios.get(`/api/menus/${placeId}`)
                .then((res) => {
                    console.log(res.data);
                    setMenuList(res.data);
                })

    }, []);

    if (menuList === null) {
        return <Spinner />;
    }

    return (
        <Box>
            {/*{menuList.map((menu, index) => (*/}
            {/*    <Box key={index}>*/}
            {/*        <Image src={menu.image} alt={menu.name} />*/}
            {/*        <Text>{menu.name}</Text>*/}
            {/*        <Text>{menu.price}</Text>*/}
            {/*    </Box>*/}
            {/*))}*/}
        </Box>
    );
}
