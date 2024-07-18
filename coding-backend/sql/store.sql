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
FROM payment;

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