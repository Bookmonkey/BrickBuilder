create table studio (
  id serial not null primary key,
  studio_id text not null,
  is_public boolean,
  password text,
  title text,
  colour text,
  direction_light integer[],
  skybox text,
  ground text,
  brick_state json
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
  height decimal,
  model_reference text
);

insert into brick_definition(title, dim_x, dim_y, height, model_reference) VALUES
('Brick 1X2', 50, 50, 50, null),
('Brick 2X2', 50, 100, 50, null),
('Plate 1X8', 1, 8, 2.0, null),
('Plate 2X16', 1, 16, 2.0, null);

create table brick_colour (
  id serial not null primary key,
  lego_id int not null,
  name text not null,
  hex_code text not null
);

insert into brick_colour(lego_id, name, hex_code) VALUES
(1,'White', '#ffffff'),
(5,'Brick Yellow', '#D9BB7B'),
(18,'Nougat', '#D67240'),
(21,'Bright Red', '#ff0000'),
(23,'Bright Blue', '#0000ff'),
(24,'Bright Yellow', '#Ffff00'),
(26,'Black', '#000000'),
(28,'Dark Green', '#009900'),
(37,'Bright Green', '#00cc00'),
(38,'Dark Orange', '#A83D15'),
(102,'Medium Blue', '#478CC6'),
(106,'Bright Orange', '#ff6600'),
(107,'Bright Bluish Green', '#059D9E'),
(119,'Bright Yellowish-Green', '#95B90B'),
(124,'Bright Reddish Violet', '#990066'),
(135,'Sand Blue', '#5E748C'),
(138,'Sand Yellow', '#8D7452'),
(140,'Earth Blue', '#002541'),
(141,'Earth Green', '#003300'),
(151,'Sand Green', '#5F8265'),
(154,'Dark Red', '#80081B'),
(191,'Flame Yellowish Orange', '#F49B00'),
(192,'Reddish Brown',  'brown#5B1C0C'),
(194,'Medium Stone Grey', '#9C9291'),
(199,'Dark Stone Grey', '#4C5156'),
(208,'Light Stone Grey', '#E4E4DA'),
(212,'Light Royal Blue', '#87C0EA'),
(221,'Bright Purple', '#DE378B'),
(222,'Light Purple', '#EE9DC3'),
(226,'Cool Yellow', '#FFFF99'),
(268,'Medium Lilac', '#2C1577'),
(283,'Light Nougat', '#F5C189'),
(308,'Dark Brown', '#300F06'),
(312,'Medium Nougat', '#AA7D55'),
(321,'Dark Azur', '#469bc3'),
(322,'Medium Azur', '#68c3e2'),
(323,'Aqua', '#d3f2ea'),
(324,'Medium Lavender', '#a06eb9'),
(325,'Lavender', '#cda4de'),
(329,'White Glow', '#f5f3d7'),
(326,'Spring Yellowish Green', '#e2f99a'),
(330,'Olive Green', '#77774E'),
(331,'Medium-Yellowish green', '#96B93');