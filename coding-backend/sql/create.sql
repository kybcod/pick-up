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

CREATE TABLE authority
(
    user_id INT         NOT NULL REFERENCES user (id),
    name      VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, name)
);
#TODO : userId, category NOT NULL로 변경, id INT PRIMARY KEY AUTO_INCREMENT,
CREATE TABLE restaurant
(
    restaurant_id     BIGINT PRIMARY KEY,
    user_id           INT,
    category          VARCHAR(50),
    restaurant_name   VARCHAR(100) NOT NULL,
    restaurant_number VARCHAR(20),
    address           VARCHAR(100) NOT NULL,
    inserted          DATETIME     NOT NULL DEFAULT NOW()
);

CREATE TABLE menu
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT,
    name          VARCHAR(100) NOT NULL,
    price         VARCHAR(20)  NOT NULL,
    img           VARCHAR(300),
    inserted      DATETIME     NOT NULL DEFAULT NOW(),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant (restaurant_id)
);