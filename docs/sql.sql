create table studio (
  id serial not null primary key,
  studio_id text not null,
  is_public boolean,
  password text,
  colour text,
  title text
);

create table member (
  id serial not null primary key,
  token text not null
);

create table brick_definition (
  id serial not null primary key,
  title text,
  dim_x int,
  dim_y int,
  model_reference text
);

create table brick_colour (
  id serial not null primary key,
  lego_id int,
  name text,
  css_class text
);

insert into brick_colour(lego_id, name, css_class) VALUES
(1, 'Bright Red', 'red'),
(1, 'Dark Green', 'green'),
(1, 'Bright Blue', 'blue'),
(1, 'Bright Yellow', 'yellow'),
(1, 'Black', 'black'),
(1, 'Bright Purple', 'purple'),
(1, 'White' , 'white' );