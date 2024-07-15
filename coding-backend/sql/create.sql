use prj4;

CREATE TABLE user
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    email        VARCHAR(100) NOT NULL,
    password     VARCHAR(200) NOT NULL,
    phone_number VARCHAR(15)  NOT NULL,
    nick_name    VARCHAR(50)  NOT NULL,
    address      VARCHAR(300),
    inserted     DATETIME     NOT NULL DEFAULT NOW()
);

#TODO : userId, category NOT NULL로 변경
CREATE TABLE restaurant
(
    id                INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id     LONG,
    user_id           INT,
    category          VARCHAR(50),
    restaurant_name   VARCHAR(100) NOT NULL,
    restaurant_number VARCHAR(20),
    address           VARCHAR(100) NOT NULL,
    inserted          DATETIME     NOT NULL DEFAULT NOW()
);