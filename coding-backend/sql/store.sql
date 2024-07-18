USE prj4;

SELECT *
FROM restaurant;

SELECT *
FROM cart;

DELETE
FROM restaurant;

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

# "한식", "중식", "일식", "분식", "양식", "카페",
#     "치킨", "피자", "족발 • 보쌈", "버거",

# 아시아음식, 패스트푸드

INSERT INTO category (name, group_code)
VALUES ('카페', 'CE7');


SELECT c.id,
       c.restaurant_id,
       c.user_id,
       c.menu_name,
       c.menu_count,
       c.menu_price,
       c.total_price,
       c.inserted,
       c.payment_status,
       p.pick_up_status,
       p.review_status
FROM cart c
         JOIN order p ON c.restaurant_id = p.restaurant_id
WHERE c.user_id = 9
  AND c.payment_status = TRUE;