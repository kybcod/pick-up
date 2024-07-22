import React, {useState} from 'react';
import {Box, Button, FormLabel, Heading, Input, Select} from "@chakra-ui/react";

const MenuItem = ({item, index, handleChange, handleRemove, handleAdd}) => (
    <Box display="flex" alignItems="center" mb={4} p={4} border="1px solid #ddd" borderRadius="md" bg="gray.50">
        <Input type="file" mr={2}/>
        <Input
            placeholder="제품명"
            value={item.name}
            onChange={(e) => handleChange(e, index, 'name')}
            mr={2}
        />
        <Input
            type="number"
            placeholder="가격"
            value={item.price}
            onChange={(e) => handleChange(e, index, 'price')}
            mr={2}
        />
        <Button colorScheme="purple" onClick={() => handleRemove(index)}>-</Button>
        <Button colorScheme="purple" onClick={handleAdd}>+</Button>
    </Box>
);

function RegisterRestaurant(props) {
    const [menuItems, setMenuItems] = useState([{name: '', price: 0}]);

    const handleChange = (e, index, key) => {
        const updatedItems = [...menuItems];
        updatedItems[index][key] = e.target.value;
        setMenuItems(updatedItems);
    };

    const handleAddItem = () => {
        setMenuItems([...menuItems, {name: '', price: 0}]);
    };

    const handleRemoveItem = (index) => {
        if (index > 0) {
            const updatedItems = menuItems.filter((_, i) => i !== index);
            setMenuItems(updatedItems);
        }
    };

    return (
        <Box>
            <Box mb={8}>
                <Heading>가게 정보</Heading>
                <FormLabel>사업장 번호</FormLabel>
                <Input type="number"/>
                <FormLabel>가게 이름(상호명)</FormLabel>
                <Input/>
                <FormLabel>가게 전화번호</FormLabel>
                <Input/>
                <FormLabel>가게 주소</FormLabel>
                <Input/>
                <FormLabel>카테고리 선택</FormLabel>
                <Select placeholder="카테고리 선택">
                    <option value="1">한식</option>
                    <option value="2">중식</option>
                    <option value="3">일식</option>
                    <option value="4">분식</option>
                    <option value="5">양식</option>
                    <option value="6">치킨</option>
                    <option value="7">아시아음식</option>
                    <option value="8">버거</option>
                    <option value="9">카페</option>
                </Select>
                <FormLabel>로고 등록</FormLabel>
                <Input type="file"/>
            </Box>
            <Box>
                <Heading>메뉴 정보</Heading>
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        index={index}
                        item={item}
                        handleChange={handleChange}
                        handleRemove={handleRemoveItem}
                        handleAdd={handleAddItem}
                    />
                ))}
                {/*<Button mt={4} colorScheme="purple" onClick={handleAddItem}>*/}
                {/*    제품정보 추가*/}
                {/*</Button>*/}
            </Box>

            <Box>
                <Button>입점하기</Button>
            </Box>
        </Box>
    );
}

export default RegisterRestaurant;
