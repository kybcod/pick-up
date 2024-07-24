USE prj4;

SELECT *
FROM restaurant;

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

SELECT *
FROM menu;

SELECT *
FROM cart;

SELECT *
FROM user;

SELECT *
FROM orders;

SELECT *
FROM review;

SELECT *
FROM review_file;

SELECT *
FROM category;