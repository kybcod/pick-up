import React from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Button } from "@chakra-ui/react";

const PostCode = ({ onSelectAddress }) => {
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onSelectAddress(fullAddress); // 선택된 주소를 부모 컴포넌트로 전달
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return <Button onClick={handleClick}>주소 찾기</Button>;
};

export default PostCode;
