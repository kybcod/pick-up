import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from "@chakra-ui/react";
import EditRestaurant from "./EditRestaurant.jsx";
import EditRestaurantMenu from "./EditRestaurantMenu.jsx";
import { useNavigate, useParams } from "react-router-dom";

const steps = [
  { title: "가게 정보", description: "기본 정보 수정" },
  { title: "메뉴 수정", description: "메뉴 정보 수정" },
  { title: "완료", description: "수정 완료" },
];

function RestaurantEditProcess() {
  const { restaurantId } = useParams();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const navigate = useNavigate();

  const handleRestaurantInfoSubmit = () => {
    setActiveStep(1);
  };

  const handleMenuSubmit = () => {
    setActiveStep(2);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={8}>가게 수정</Heading>
      <Stepper size="lg" colorScheme="yellow" index={activeStep} mb={8}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <EditRestaurant
          restaurantId={restaurantId}
          onSubmit={handleRestaurantInfoSubmit}
        />
      )}
      {activeStep === 1 && (
        <EditRestaurantMenu
          restaurantId={restaurantId}
          onSubmit={handleMenuSubmit}
        />
      )}
      {activeStep === 2 && (
        <Box textAlign="center" p={8}>
          <Heading size="xl">수정에 성공했습니다!</Heading>
          <Box mb={2} mt={4}>
            가게 정보와 메뉴가 성공적으로 수정되었습니다.
          </Box>
          <Button onClick={() => navigate("/seller")}>
            메인 페이지로 이동
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default RestaurantEditProcess;
