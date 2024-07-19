import {
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    Textarea,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../component/LoginProvider.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {faStar as fullStar} from "@fortawesome/free-solid-svg-icons";

export function OrderList() {
    const account = useContext(LoginContext);
    const userId = account.id;
    const [orderList, setOrderList] = useState(null);
    const navigate = useNavigate();
    const {onClose, onOpen, isOpen} = useDisclosure();
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        axios.get(`api/orders/${userId}`).then((res) => {
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

    function handleReview() {
        const formData = new FormData();
        formData.append('restaurantId', selectedRestaurant);
        formData.append('userId', userId);
        formData.append('rating', rating); // 수정된 부분
        formData.append('content', content);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        axios.postForm('/api/reviews', formData)
            .then((res) => {
                console.log("리뷰 저장");
                onClose();
            })
            .catch((error) => console.log("리뷰 저장 실패", error));
    }

    function handleOpenModal(restaurantId) {
        setSelectedRestaurant(restaurantId);
        onOpen();
    }

    function handleStar(num) {
        setRating(num);
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
                                <Button onClick={() => handleOpenModal(group.restaurantId)}>리뷰쓰기</Button> :
                                <Badge>안돼</Badge>
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
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>{selectedRestaurant} 리뷰 작성</ModalHeader>
                        <ModalBody>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <Box onClick={() => handleStar(num)} key={num} display="inline-block"
                                     cursor="pointer">
                                    <FontAwesomeIcon icon={num <= rating ? fullStar : emptyStar}
                                                     style={{color: "#FFD43B",}}/>
                                </Box>
                            ))}
                            <Input multiple type={"file"} accept={"image/*"}
                                   onChange={(e) => setFiles(e.target.files)}/>
                            <Textarea resize={"none"}
                                      height={"100px"}
                                      borderColor="gray.400"
                                      value={content}
                                      onChange={(e) => setContent(e.target.value)}
                                      placeholder="음식의 맛, 양, 포장 상태 등 음식에 대한 솔직한 리뷰를 남겨주세요.(선택)"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={handleReview}>
                                완료
                            </Button>
                            <Button onClick={onClose}>취소</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Box>
    );
}
