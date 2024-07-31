SELECT *
FROM user;

INSERT INTO authority (user_id, name) VALUES (2, 'admin');

SELECT *
FROM authority;

ALTER TABLE user
    ADD CONSTRAINT unique_nick_name UNIQUE (nick_name);

INSERT INTO user (email, password, phone_number, nick_name)
VALUES ('example@ex', 'aa', '010-1111-1111', 12);

DELETE FROM user
WHERE id = 70;

DELETE FROM authority
WHERE user_id=70;