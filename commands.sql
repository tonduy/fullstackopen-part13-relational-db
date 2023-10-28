Exercise 13.2:
CREATE TABLE blogs (
    id serial PRIMARY KEY,
    author VARCHAR(255),
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Author1', 'https://blog1.com', 'Test 1',2);

INSERT INTO blogs (author, url, title, likes) VALUES
('Author2', 'https://blog2.com', 'Test 2',42);