import {Badge, Box, Button, Divider, Flex, Heading, Spinner, Text, VStack} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../component/LoginProvider.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function OrderList() {
    const account = useContext(LoginContext);
    const userId = account.id;
    const [orderList, setOrderList] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`api/payments/orders/${userId}`).then((res) => {
            console.log(res.data);
            const groupedOrders = groupOrders(res.data);
            setOrderList(groupedOrders);
        });
    }, []);

    const groupOrders = (orders) => {
        return orders.reduce((acc, order) => {
            const key = `${order.restaurantId}_${order.inserted}`;
            if (!acc[key]) {
                acc[key] = {
                    restaurantId: order.restaurantId,
                    inserted: order.inserted,
                    pickUpStatus: order.pickUpStatus,
                    paymentStatus: order.paymentStatus,
                    items: []
                };
            }
            acc[key].items.push(order);
            return acc;
        }, {});
    };

    if (orderList === null) {
        return <Spinner/>;
    }

    return (
        <Box maxW="800px" margin="auto" p={5}>
            <Heading mb={6}>주문 내역</Heading>
            <VStack spacing={6} align="stretch">
                {Object.values(orderList).map((group, index) => (
                    <Box key={index} borderWidth={1} borderRadius="lg" p={4} boxShadow="md">
                        <Box>
                            {group.pickUpStatus ?
                                <Badge>픽업완료</Badge> : <Badge>픽업대기</Badge>
                            }
                            {/*TODO:pickUpStatus => True일 떄로 바꾸기*/}
                            {group.paymentStatus ?
                                <Button>리뷰쓰기</Button> : <Badge>안돼</Badge>
                            }
                        </Box>
                        <Flex justify="space-between" align="center" mb={3}>
                            <Heading size="md" onClick={() => navigate(`/menu/${group.restaurantId}`)}>식당
                                ID: {group.restaurantId}</Heading>
                            <Badge colorScheme="green">{new Date(group.inserted).toLocaleString()}</Badge>
                        </Flex>
                        <Divider mb={3}/>
                        {group.items.map((item, itemIndex) => (
                            <Box key={itemIndex} mb={2}>
                                <Flex justify="space-between">
                                    <Text fontWeight="bold">{item.menuName}</Text>
                                    <Text>{item.menuCount}개</Text>
                                </Flex>
                                <Text color="gray.600">가격: {item.menuPrice.toLocaleString()}원</Text>
                            </Box>
                        ))}
                        <Divider mt={3} mb={3}/>
                        <Flex justify="flex-end">
                            <Text fontWeight="bold">
                                총
                                금액: {group.items.reduce((sum, item) => parseInt(item.totalPrice), 0).toLocaleString()}원
                            </Text>
                        </Flex>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}