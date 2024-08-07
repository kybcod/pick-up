![pickUp_black](https://github.com/user-attachments/assets/32da3d3f-c30e-4caa-b634-6169fb4854b6)

## **🌟 서비스 소개**

- '**픽업의 민족**' 은 “사용자의 위치"를 기반으로 식당 음식 픽업 서비스입니다.
- 지도 api를 통해 현재 위치와 식당 정보를 제공합니다.
- 사장님과 구매자 권한을 분리하여 유저 권한에 따라, 각각 다른 서비스를 이용할 수 있게 합니다.
    - 사장님은 가게 등록 및 가게를 관리합니다.
    - 구매자는 현위치를 바탕으로 원하는 식당을 탐색하여 카테고리 별 메뉴를 통해 식당 선택이 가능하며 먹고 싶은 메뉴 주문 후 픽업이 가능합니다.

<br>


## **👨‍👨‍👧‍👦 팀원 소개**

**Ye Been Kim**

- 🐍 Github: [https://github.com/kybcod]

**Jeong Yun Heo**

- 🐴 Github : [https://github.com/JeongYunheo]

<br>

## **🔨 기술 스택**
![skils](https://github.com/user-attachments/assets/ba4e7dcb-67d3-46f3-ba9a-03608c8ef886)

- **Backend :  Java, Spring Boot, MyBatis**
- **Frontend : React, Vite, Node.js**
- **Server :  AWS EC2**
- **Management : Git, GitHub**
- **Database : AWS S3, MariaDB, Docker**

<br>


# **📆 서비스 개발 개요**

## 기획 의도

- 현 위치와 지도 api를 활용한 서비스 구축을 목표로 합니다.
- 위치를 활용해, 내 근처 식당을 쉽게 찾고 원격으로 이용할 수 있는 서비스입니다.
- 대기 시간을 단축하고 배달료를 절약할 수 있는 방법입니다.
    - 고물가 시대에 효율적인 소비와 이익 창출을 도모합니다.

## **개발 일정**

- **총 진행 기간**: 2024.07.09 ~ 2024.08.05 ( 28일 )
- **설계 기간**: 2024.07.09 ~ 2024.07.10 ( 와이어 프레임, DB 구조 설계)
- 화면 / 기능 구현, **피드백 반영 기간**: 2024.07.11 ~ 2024.07.31 ( 21일 )
- 테스트 기간 : 2024.08.01 ~ 2024.08.05 ( 5일 )

## 와이어 프레임
![와이어프레임](https://github.com/user-attachments/assets/6976331b-2e4f-49b6-8dbd-344db89c7bc4)


## ERD
![erd_pickUp](https://github.com/user-attachments/assets/500158a6-ba6f-481e-b6c2-72bb7c9dc776)


**⚙ 개발 환경 및 IDE**

- Spring Boot 3.2.6
- Java 21.0.3
- React 18.2.0

<br>


## **⭐️ 주요 기능**

## 회원가입 및 로그인

- **회원가입**
    - 

- **로그인**
    - 

## 사장님 : 가게 등록 및 메뉴 등록
<div style="display: flex; justify-content: center;">
    <img src="https://github.com/user-attachments/assets/b476ff82-6b1a-4345-8f6f-2b0faeaefecd" alt="판)가게등록2 (2)" style="width: 50%;">
    <img src="https://github.com/user-attachments/assets/a49b6dda-440c-4d3f-b774-08ba737bdafb" alt="판)가게등록2 (1)" style="width: 50%;">
</div>


- **가게 등록**
    - 사업장 번호, 이름, 전화번호, 주소, 카테고리, 로고 이미지를 입력받아 가게를 등록합니다.
    - 가게 주소를 찾을 때는 다음 우편번호 api를 사용해서 입력받습니다.

![판)메뉴능록](https://github.com/user-attachments/assets/318b63fa-5ae0-48cd-91db-620144f454dc)

- **메뉴 등록**
    - 메뉴 이미지, 메뉴 명, 메뉴 가격을 입력합니다.
    - 메뉴를 추가 및 삭제할 수 있습니다.

## 사장님 : 주문확인
![판)주문확인](https://github.com/user-attachments/assets/c1d2af84-0b12-4f14-a90c-82581e9764ee)
![판)예상소요시간모달](https://github.com/user-attachments/assets/b36dcb47-f0db-4689-ad7a-6f32594f06d8)

- 사장님이 주문 내역을 확인하고 처리합니다. 사용자는 주문 목록을 보고 각 주문의 세부사항을 모달을 통해 확인하며, 주문을 접수하거나 픽업 완료 상태로 변경할 수 있습니다.
    - 주문 접수 클릭 시 모달을 띄워 픽업 예상 소요 시간 입력합니다.
    - 주문 내역에서 주문 접수에서 픽업대기 바뀌고 만약 구매자가 픽업을 완료 했다면 픽업 대기 버튼을 눌러 픽업 완료로 바꿔줍니다.

## 구매자 : 주문하기
![구)사용자 메인](https://github.com/user-attachments/assets/e572dfbc-742d-44a1-92ef-ebed41e06dda)
![구)식당리스트](https://github.com/user-attachments/assets/50bfb2c3-c70d-460f-8432-e8a2ec0f26a4)

- 카테고리를 선택하면 해당 카테고리에 맞는 식당 리스트가 보입니다.
- 커스텀 오버레이를 통해 지도에서 마커를 클릭하면 해당 가게에 대한 정보를 보여줍니다.

![구)메뉴선택 (1)](https://github.com/user-attachments/assets/ae34ba85-845f-4183-9c30-1c7c727048d0)

- **메뉴 선택**
    - 주문하고 싶은 메뉴를 선택하고 취소할 수 있습니다.
    - 장바구니 담기를 누르면 해당 주문 내역이 장바구니에 담깁니다.
    - 주문하기 버튼을 누르면 결제 페이지로 이동합니다.

![구)주문내역](https://github.com/user-attachments/assets/fa20ec25-5b21-484e-9efb-f399c0acc8f0)
![구)리뷰](https://github.com/user-attachments/assets/3e52d8ec-0728-4d74-90c0-9bf62c4a80dd)

- **주문 내역**
    - 주문을 완료하면 “접수 완료” 벳지가 보이며 판매자 측에서 예상 소요 시간이 입력되면  픽업 대기 시간이 나옵니다.
    - 픽업 완료 후에는 리뷰를 작성할 수 있습니다.

<br>

## 🎞 최종산출물
