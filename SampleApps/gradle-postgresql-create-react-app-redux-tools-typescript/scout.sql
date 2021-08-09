CREATE TABLE colonist (
  colonist_id serial primary key,
  colonist_name varchar(20) UNIQUE NOT NULL,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp);

INSERT INTO colonist (colonist_name)
VALUES
    ('Han'),
    ('Luke'),
    ('Leia'),
    ('Vader');