import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function SellerMenusDetails(props) {
  const { restaurantId } = useParams();
  const [menuList, setMenuList] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const fileInputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/menus/${restaurantId}`).then((res) => {
      console.log("res", res.data);
      setMenuList(res.data);
      fileInputRefs.current = res.data.menuInfo.menuList.map(() =>
        React.createRef(),
      );
      fileInputRefs.current.unshift(React.createRef()); // For the logo input ref
    });
  }, [restaurantId]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId);
    formData.append("restaurantName", menuList.basicInfo.placenamefull);
    formData.append("restaurantTel", menuList.basicInfo.phonenum);

    const logoFile = fileInputRefs.current[0].current.files[0];
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    menuList.menuInfo.menuList.forEach((item, index) => {
      formData.append(`menuItems[${index}].restaurantId`, restaurantId);
      formData.append(`menuItems[${index}].name`, item.menu);
      formData.append(`menuItems[${index}].price`, item.price);
      const menuItemFile = fileInputRefs.current[index + 1].current.files[0];
      if (menuItemFile) {
        formData.append(`menuItems[${index}].img`, menuItemFile);
      }
    });

    axios
      .putForm(`/api/menus/seller`, formData)
      .then((res) => {
        toast({
          description: "메뉴 정보가 성공적으로 업데이트되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(error);
        toast({
          description: "메뉴 정보 업데이트 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handelMenuAdd = () => {
    setMenuList((prevState) => {
      const newMenuList = [
        ...prevState.menuInfo.menuList,
        { menu: "", price: "", img: "" },
      ];
      fileInputRefs.current = [...fileInputRefs.current, React.createRef()];
      return {
        ...prevState,
        menuInfo: {
          ...prevState.menuInfo,
          menucount: prevState.menuInfo.menucount + 1,
          menuList: newMenuList,
        },
      };
    });
  };

  const handleMenuDelete = (index) => {
    setMenuList((prevState) => {
      const newMenuList = [...prevState.menuInfo.menuList];
      newMenuList.splice(index, 1);
      fileInputRefs.current.splice(index + 1, 1);
      return {
        ...prevState,
        menuInfo: {
          ...prevState.menuInfo,
          menucount: prevState.menuInfo.menucount - 1,
          menuList: newMenuList,
        },
      };
    });
  };

  const handleImageChange = (e, section, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuList((prevState) => {
          if (section === "basicInfo") {
            return {
              ...prevState,
              basicInfo: {
                ...prevState.basicInfo,
                mainphotourl: reader.result,
              },
            };
          } else if (section === "menuInfo") {
            const newMenuList = [...prevState.menuInfo.menuList];
            newMenuList[index] = { ...newMenuList[index], img: reader.result };
            return {
              ...prevState,
              menuInfo: { ...prevState.menuInfo, menuList: newMenuList },
            };
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e, section, index, field) => {
    const { value } = e.target;
    setMenuList((prevState) => {
      if (section === "basicInfo") {
        return {
          ...prevState,
          basicInfo: { ...prevState.basicInfo, [field]: value },
        };
      } else if (section === "menuInfo") {
        const newMenuList = [...prevState.menuInfo.menuList];
        newMenuList[index] = { ...newMenuList[index], [field]: value };
        return {
          ...prevState,
          menuInfo: { ...prevState.menuInfo, menuList: newMenuList },
        };
      }
    });
  };

  const handleDelete = () => {
    axios
      .delete(`/api/menus/${restaurantId}`)
      .then((res) => {
        toast({
          description: "해당 가게가 삭제되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/seller");
      })
      .catch((error) => {
        console.error(error);
        toast({
          description: "삭제 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  if (menuList === null) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  }

  const handelUpdate = () => {
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <Box maxWidth="800px" margin="auto" p={5}>
      <VStack spacing={6} align="stretch">
        {/* 가게 기본 정보 : 로고, 가게명, 전화번호*/}
        <Box boxShadow="md" borderRadius="lg" overflow="hidden">
          <Box
            position="relative"
            onClick={() =>
              isEditing && fileInputRefs.current[0].current.click()
            }
          >
            <Image
              src={menuList.basicInfo.mainphotourl}
              alt={menuList.basicInfo.placenamefull}
              width="100%"
              height="200px"
              cursor={"pointer"}
            />
            {isEditing && (
              <Box
                position="absolute"
                bottom="10px"
                right="10px"
                bg="rgba(0,0,0,0.5)"
                p={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FontAwesomeIcon icon={faCamera} color="white" size="lg" />
              </Box>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "basicInfo")}
              ref={fileInputRefs.current[0]}
              display="none"
            />
          </Box>
          <Box p={4}>
            <FormControl>
              <FormLabel>가게 이름</FormLabel>
              <Input
                value={menuList.basicInfo.placenamefull}
                onChange={(e) =>
                  handleInputChange(e, "basicInfo", null, "placenamefull")
                }
                isReadOnly={!isEditing}
              />
            </FormControl>
            <FormControl>
              <FormLabel>가게 전화번호</FormLabel>
              <Input
                value={menuList.basicInfo.phonenum}
                onChange={(e) =>
                  handleInputChange(e, "basicInfo", null, "phonenum")
                }
                isReadOnly={!isEditing}
              />
            </FormControl>
          </Box>
        </Box>

        {/* 메뉴 목록 */}
        <Flex justify={"space-between"} align={"center"} mt={6} mb={4}>
          <Heading size="md">메뉴 ({menuList.menuInfo.menucount})</Heading>
          {isEditing && (
            <Button
              leftIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={handelMenuAdd}
            >
              메뉴 추가
            </Button>
          )}
        </Flex>

        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {menuList.menuInfo.menuList.map((item, index) => (
            <Box
              key={index}
              boxShadow="md"
              borderRadius="lg"
              overflow="hidden"
              position="relative"
            >
              <Box
                position="relative"
                onClick={() =>
                  isEditing && fileInputRefs.current[index + 1].current.click()
                }
              >
                <Image
                  src={item.img}
                  alt={item.menu}
                  width="100%"
                  height="150px"
                  cursor={isEditing ? "pointer" : "default"}
                />
                {isEditing && (
                  <Box
                    position="absolute"
                    bottom="10px"
                    right="10px"
                    bg="rgba(0,0,0,0.5)"
                    p={2}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FontAwesomeIcon icon={faCamera} color="white" size="lg" />
                  </Box>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "menuInfo", index)}
                  ref={fileInputRefs.current[index + 1]}
                  display="none"
                />
              </Box>
              <Box p={4}>
                <FormControl>
                  <FormLabel>메뉴 이름</FormLabel>
                  <Input
                    value={item.menu}
                    onChange={(e) =>
                      handleInputChange(e, "menuInfo", index, "menu")
                    }
                    isReadOnly={!isEditing}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>가격</FormLabel>
                  <Input
                    value={item.price}
                    onChange={(e) =>
                      handleInputChange(e, "menuInfo", index, "price")
                    }
                    isReadOnly={!isEditing}
                  />
                </FormControl>
                {isEditing && (
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={() => handleMenuDelete(index)}
                    leftIcon={<FontAwesomeIcon icon={faTrash} />}
                  >
                    삭제
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {isEditing ? (
          <Button colorScheme="blue" onClick={handleSave}>
            저장
          </Button>
        ) : (
          <Button colorScheme="teal" onClick={handelUpdate}>
            수정
          </Button>
        )}
        <Button colorScheme="red" onClick={handleDelete}>
          삭제
        </Button>
      </VStack>
    </Box>
  );
}

export default SellerMenusDetails;
