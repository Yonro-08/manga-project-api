create Table person(
  id Serial Primary Key,
  name VARCHAR(255),
  surname VARCHAR(255)
);

create Table post(
  id Serial Primary Key,
  title VARCHAR(255),
  content VARCHAR(255),
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES person (id)
);