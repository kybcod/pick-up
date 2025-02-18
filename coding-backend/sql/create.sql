use prj4;

CREATE TABLE user
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    email        VARCHAR(100) NOT NULL,
    password     VARCHAR(200) NOT NULL,
    phone_number VARCHAR(15)  NOT NULL,
    nick_name    VARCHAR(50)  NOT NULL UNIQUE,
    address      VARCHAR(300),
    inserted     DATETIME     NOT NULL DEFAULT NOW()
);

CREATE TABLE authority
(
    user_id INT         NOT NULL REFERENCES user (id),
    name    VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, name)
);


CREATE TABLE restaurant
(
    restaurant_id   BIGINT PRIMARY KEY,
    user_id         INT          NOT NULL REFERENCES user (id),
    restaurant_name VARCHAR(100) NOT NULL,
    restaurant_tel  VARCHAR(20),
    address         VARCHAR(100) NOT NULL,
    inserted        DATETIME     NOT NULL DEFAULT NOW(),
    logo            VARCHAR(500),
    latitude        DOUBLE,
    longitude       DOUBLE,
    category_id     INT          NOT NULL
);


CREATE TABLE menu
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT       NOT NULL REFERENCES restaurant (restaurant_id),
    name          VARCHAR(100) NOT NULL,
    price         VARCHAR(20)  NOT NULL,
    img           VARCHAR(300),
    inserted      DATETIME     NOT NULL DEFAULT NOW()
);

CREATE TABLE cart
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT      NOT NULL,
    user_id       INT         NOT NULL REFERENCES user (id),
    menu_name     VARCHAR(50),
    menu_count    INT         NOT NULL,
    menu_price    VARCHAR(50) NULL,
    order_id      INT,
    inserted      DATETIME    NOT NULL DEFAULT NOW()
);


CREATE TABLE category
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(10) NOT NULL,
    group_code VARCHAR(10) NOT NULL
);


CREATE TABLE orders
(
    id             INT PRIMARY KEY AUTO_INCREMENT,
    merchant_uid   VARCHAR(50) NOT NULL,
    restaurant_id  LONG        NOT NULL,
    user_id        INT         NOT NULL REFERENCES user (id),
    inserted       DATETIME    NOT NULL DEFAULT NOW(),
    total_price    INT         NOT NULL,
    pick_up_state  BOOLEAN     NOT NULL DEFAULT FALSE,
    review_status  BOOLEAN     NOT NULL DEFAULT FALSE,
    estimated_time VARCHAR(10) NULL
);

CREATE TABLE review
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT       NOT NULL,
    user_id       INT          NOT NULL REFERENCES user (id),
    rating        INT          NOT NULL,
    content       VARCHAR(100) NOT NULL,
    inserted      DATETIME     NOT NULL DEFAULT NOW()
);

CREATE TABLE review_file
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    review_id INT          NOT NULL REFERENCES review (id),
    file_name VARCHAR(200) NOT NULL
);

CREATE TABLE favorites
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT      NOT NULL,
    restaurant_id BIGINT   NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT NOW()
);