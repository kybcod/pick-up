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
FROM authority;

SELECT *
FROM orders;

SELECT *
FROM review;

SELECT *
FROM review_file;

SELECT *
FROM category;

SELECT *
FROM favorites;

SELECT *
FROM restaurant r
         JOIN review rv ON r.restaurant_id = rv.restaurant_id
WHERE r.restaurant_id = 2092129811;