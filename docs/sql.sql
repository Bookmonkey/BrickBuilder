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
)