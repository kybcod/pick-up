import {Box, Button, Flex, Spinner, Text,} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

export function Payment() {
    const {userId, restaurantId} = useParams();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [merchantUid, setMerchantUid] = useState("");


    useEffect(() => {
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(iamport);
        };
    }, []);

    useEffect(() => {
        axios.get(`/api/orders/${userId}/${restaurantId}`).then((res) => {
            console.log(res.data)
            setPaymentInfo(res.data);
            generateMerchantUid();
        });

    }, []);

    // 주문번호 랜덤으로 받기
    function generateMerchantUid() {
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        let orderNum = month + day;
        for (let i = 0; i < 10; i++) {
            orderNum += Math.floor(Math.random() * 8);
        }
        setMerchantUid(orderNum);
    }

    function onClickPayment() {
        const {IMP} = window;
        IMP.init(import.meta.env.VITE_KAKAO_KEY);

        //TODO: 나중에 구매자 관련 정보 추가하기 JOIN해서
        const data = {
            // pg: "nice_v2", // 나이스
            pg: "kakaopay", // 카카오페이
            pay_method: "card", // 결제수단
            merchant_uid: merchantUid, // 주문번호
            // amount: paymentInfo[0].totalPrice, // 결제금액
            amount: 1, // 결제금액
            name: restaurantId, // 주문명
            buyer_name: userId, // 구매자 이름
            buyer_tel: "010", // 구매자 전화번호
            buyer_email: "email", // 구매자 이메일
            m_redirect_url: "/", // 모바일 결제 후 리디렉션될 URL : 채팅방으로
        };

        IMP.request_pay(data, callback);

        const cartIds = paymentInfo.map((info) => info.id)

        function callback(response) {
            const {success, error_msg} = response;

            if (success) {
                axios
                    .post(`/api/orders`, {
                        merchantUid,
                        restaurantId,
                        userId,
                        cartIds
                    })
                    .then(() => {
                        alert(`결제성공`);
                    })
                    .catch(() => {
                        alert("결제 처리 중 오류", error_msg)
                    })
                    .finally(() => {
                        // navigate(`/chat/product/${product.id}/buyer/${account.id}`);
                    });
            } else {
                alert(`${error_msg}.`);
            }
        }
    }

    if (paymentInfo === null) {
        return <Spinner/>;
    }

    return (
        <Box
            maxW="600px"
            mx="auto"
            p={5}
            boxShadow="xl"
            borderRadius="lg"
            bg="white"
        >
            목록
            {paymentInfo.map((item) => (
                <Box key={item.id}>
                    <Text>{item.menuName}</Text>
                    <Text>{item.menuPrice}</Text>
                    <Text>{item.menuCount}</Text>
                </Box>
            ))}
            <Box>
                {/*{paymentInfo[0].totalPrice.toLocaleString()} 원*/}
            </Box>
            <Flex>
                <Button>뒤로가기</Button>
                <Button onClick={onClickPayment}>결제하기</Button>
            </Flex>
        </Box>
    );
}
