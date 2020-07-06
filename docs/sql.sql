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
(1,'White', 'white'),
(5,'Brick Yellow', 'tan'),
(18,'Nougat', 'nougat'),
(21,'Bright Red', 'red'),
(23,'Bright Blue', 'blue'),
(24,'Bright Yellow', 'yellow'),
(26,'Black', 'black'),
(28,'Dark Green', 'green'),
(37,'Bright Green', 'bright-green'),
(38,'Dark Orange', 'dark-orange'),
(102,'Medium Blue', 'medium-blue'),
(106,'Bright Orange', 'orange'),
(107,'Bright Bluish Green', 'teal'),
(119,'Bright Yellowish-Green', 'lime'),
(124,'Bright Reddish Violet', 'magenta'),
(135,'Sand Blue', 'sand-blue'),
(138,'Sand Yellow', 'sand-yellow'),
(140,'Earth Blue', 'dark-blue'),
(141,'Earth Green', 'dark-green'),
(151,'Sand Green', 'sand-green'),
(154,'Dark Red', 'dark-red'),
(191,'Flame Yellowish Orange', 'bright-orange'),
(192,'Reddish Brown',  'brown'),
(194,'Medium Stone Grey', 'medium-grey'),
(199,'Dark Stone Grey', 'dark-grey'),
(208,'Light Stone Grey', 'light-grey'),
(212,'Light Royal Blue', 'light-blue'),
(221,'Bright Purple', 'bright-pink'),
(222,'Light Purple', 'light-pink'),
(226,'Cool Yellow', 'light-yellow'),
(268,'Medium Lilac', 'dark-purple'),
(283,'Light Nougat', 'light-orange'),
(308,'Dark Brown', 'dark-brown'),
(312,'Medium Nougat', 'medium-orange'),
(321,'Dark Azur', 'dark-azure'),
(322,'Medium Azur', 'azure'),
(323,'Aqua', 'aqua'),
(324,'Medium Lavender', 'medium-lavender'),
(325,'Lavender', 'lavender'),
(329,'White Glow', 'white-glow'),
(326,'Spring Yellowish Green', 'yellowy-green'),
(330,'Olive Green', 'olive-green'),
(331,'Medium-Yellowish green', 'dark-lime');