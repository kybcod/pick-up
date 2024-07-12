use prj4;

CREATE TABLE user(
                     id INT PRIMARY KEY AUTO_INCREMENT ,
                     email VARCHAR(100) NOT NULL,
                     password VARCHAR(200) NOT NULL,
                     phone_number VARCHAR(15) NOT NULL,
                     nick_name VARCHAR(50) NOT NULL,
                     address VARCHAR(300),
                     inserted DATETIME NOT NULL DEFAULT NOW()
);

#TODO : userId, category
CREATE TABLE store(
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    category VARCHAR(50) ,
    store_name VARCHAR(100) NOT NULL ,
    store_number VARCHAR(15) NOT NULL ,
    address VARCHAR(100) NOT NULL ,
    inserted DATETIME NOT NULL DEFAULT NOW()
);