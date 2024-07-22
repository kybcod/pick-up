import React, { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Button } from "@chakra-ui/react";

const PostCode = ({ onSelectAddress }) => {
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_API_KEY}&autoload=false&libraries=services`;
    script.onload = () => {
      kakao.maps.load(() => {
        setKakaoLoaded(true);
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleComplete = (data) => {
    if (!kakaoLoaded) {
      console.error("Kakao Maps API is not loaded yet");
      return;
    }

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

    // 위도, 경도 가져오기
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(fullAddress, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const latitude = result[0].y;
        const longitude = result[0].x;
        console.log(fullAddress, latitude, longitude);
        onSelectAddress(fullAddress, latitude, longitude); // 주소,위도,경도를 prop 전달
      }
    });
  };

  const handleClick = () => {
    if (!kakaoLoaded) return;
    open({ onComplete: handleComplete });
  };

  return (
    <Button onClick={handleClick} isDisabled={!kakaoLoaded}>
      주소 찾기
    </Button>
  );
};

export default PostCode;
