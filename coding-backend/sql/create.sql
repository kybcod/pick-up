CREATE TABLE User
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