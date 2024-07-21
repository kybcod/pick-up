// ReviewModal.jsx
import React, {useState} from 'react';
import {
    Box,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function ReviewModal({isOpen, onClose, selectedRestaurant, userId, restaurantName}) {
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);

    // function handleReview() {
    //     const formData = new FormData();
    //     formData.append('restaurantId', selectedRestaurant);
    //     formData.append('userId', userId);
    //     formData.append('rating', rating);
    //     formData.append('content', content);
    //
    //     for (let i = 0; i < files.length; i++) {
    //         formData.append('files', files[i]);
    //     }
    //
    //     axios.postForm('/api/reviews', formData)
    //         .then((res) => {
    //             console.log("리뷰 저장");
    //             onClose();
    //         })
    //         .catch((error) => console.log("리뷰 저장 실패", error));
    // }

    function handleReview() {

        // for (let i = 0; i < files.length; i++) {
        //     formData.append('files', files[i]);
        // }

        axios.postForm('/api/reviews',
            {
                restaurantId: selectedRestaurant,
                userId: userId,
                rating: rating,
                content: content,
                files: files,
            })
            .then((res) => {
                console.log("리뷰 저장");
                onClose();
            })
            .catch((error) => console.log("리뷰 저장 실패", error));
    }

    function handleStar(num) {
        setRating(num);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{restaurantName}</ModalHeader>
                <ModalBody>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <Box onClick={() => handleStar(num)} key={num} display="inline-block" cursor="pointer">
                            <FontAwesomeIcon icon={num <= rating ? fullStar : emptyStar} style={{color: "#FFD43B"}}/>
                        </Box>
                    ))}
                    <Input
                        multiple
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                    />
                    <Textarea
                        resize="none"
                        height="100px"
                        borderColor="gray.400"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="음식의 맛, 양, 포장 상태 등 음식에 대한 솔직한 리뷰를 남겨주세요.(선택)"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleReview}>
                        완료
                    </Button>
                    <Button onClick={onClose}>취소</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
