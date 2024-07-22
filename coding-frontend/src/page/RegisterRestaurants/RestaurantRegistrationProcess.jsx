import React, { useState } from "react";
import {
  Box,
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
import RegisterRestaurant from "./RegisterRestaurant";
import AddRestaurantMenu from "./AddRestaurantMenu";

const steps = [
  { title: "가게 정보", description: "기본 정보 입력" },
  { title: "메뉴 등록", description: "메뉴 정보 입력" },
  { title: "완료", description: "등록 완료" },
];

function RestaurantRegistrationProcess() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [restaurantData, setRestaurantData] = useState({});

  const handleRestaurantInfoSubmit = (data) => {
    setRestaurantData(data);
    setActiveStep(1);
  };

  const handleMenuSubmit = (menuData) => {
    setActiveStep(2);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={8}>가게 등록</Heading>
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
        <RegisterRestaurant onSubmit={handleRestaurantInfoSubmit} />
      )}
      {activeStep === 1 && (
        <AddRestaurantMenu
          onSubmit={handleMenuSubmit}
          restaurantData={restaurantData}
        />
      )}
      {activeStep === 2 && (
        <Box textAlign="center" p={8}>
          <Heading size="xl">등록에 성공했습니다!</Heading>
          <Box mt={4}>가게 정보와 메뉴가 성공적으로 등록되었습니다.</Box>
        </Box>
      )}
    </Container>
  );
}

export default RestaurantRegistrationProcess;
