USE prj4;

SELECT *
FROM restaurant;

SELECT *
FROM menu;

SELECT *
FROM cart;

SELECT *
FROM user;

SELECT *
FROM orders;

# 판매자의 가게 가져오고 그 가게의 메뉴 그 가게의 주문내역 그 가게의 리뷰
SELECT r.restaurant_id,
       r.user_id,
       r.restaurant_name,
       m.name    AS menuName,
       o.user_id AS orderUserId,
       u.nick_name,
       u.phone_number
FROM restaurant r
         JOIN menu m ON r.restaurant_id = m.restaurant_id
         JOIN orders o on r.restaurant_id = o.restaurant_id
         JOIN user u ON o.user_id = u.id;

SELECT u.nick_name,
       u.phone_number,
       r.restaurant_id,
       r.user_id,
       r.restaurant_name,
       o.user_id       AS orderUserId,
       ou.nick_name    AS buyerName,
       ou.phone_number AS buyerTel
FROM user u
         JOIN restaurant r ON u.id = r.user_id
         JOIN orders o on r.restaurant_id = o.restaurant_id
         JOIN user ou ON o.user_id = ou.id
WHERE u.id = 11;

SELECT *
FROM review;

SELECT *
FROM review_file;

SELECT *
FROM category;

SELECT m.id,
       m.restaurant_id,
       m.name,#(MenuDto.menu)
       m.price,#(MenuDto.price)
       m.img,#(MenuDto.img)
       m.inserted,
       r.restaurant_name,#(BasicInfo.placenamefull)
       r.restaurant_tel,#(BasicInfo.phonenum)
       r.logo,#(BasicInfo.mainphotourl)
       r.address
FROM menu m
         JOIN restaurant r ON m.restaurant_id = r.restaurant_id
WHERE m.restaurant_id = 2092129811;