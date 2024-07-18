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
    name    VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, name)
);
#TODO : userId, category NOT NULL로 변경, id INT PRIMARY KEY AUTO_INCREMENT,
CREATE TABLE restaurant
(
    restaurant_id     BIGINT PRIMARY KEY,
    user_id           INT,
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

CREATE TABLE cart
(
    id             INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id  BIGINT,
    user_id        INT,
    menu_name      VARCHAR(50) NOT NULL,
    menu_count     INT         NOT NULL,
    menu_price     VARCHAR(50) NOT NULL,
    total_price    INT         NOT NULL,
    payment_status BOOLEAN     NOT NULL DEFAULT FALSE,
    inserted       DATETIME    NOT NULL DEFAULT NOW()
);

CREATE TABLE category
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(10) NOT NULL,
    group_code VARCHAR(10) NOT NULL
);

CREATE TABLE payment
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    merchant_uid  VARCHAR(50) NOT NULL,
    restaurant_id LONG        NOT NULL,
    user_id       INT         NOT NULL,
    inserted      DATETIME    NOT NULL DEFAULT NOW(),
    pick_up_state BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE TABLE review
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT       NOT NULL,
    user_id       INT          NOT NULL,
    rating        INT          NOT NULL,
    content       VARCHAR(100) NOT NULL,
    inserted      DATETIME     NOT NULL DEFAULT NOW(),
    review_status BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE review_file
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT          NOT NULL REFERENCES review (id),
    file_name VARCHAR(200) NOT NULL
);
