create table studio (
  id serial not null primary key,
  studio_id text not null,
  is_public boolean,
  title text
);