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

SELECT *
FROM review;

SELECT *
FROM review_file;

SELECT *
FROM category;

SELECT *
FROM favorites;

SELECT r.content, r.inserted, r.rating, r.restaurant_id, r.user_id, u.nick_name
FROM review r
         JOIN user u on u.id = r.user_id
WHERE user_id = 9;