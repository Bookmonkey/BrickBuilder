# Brick Builder
Not a lego builder. A collaborative lego(like) builder for everyone to use. 

## Getting started
The following steps should get a working version on your own machine.

### Prerequisites
- PostgreSQL 
- NodeJS (14.0+)

### Install and run
1. Clone the repo. `git clone ...`
2. Install node_modules `npm i`
3. Create a new Postgres database using the schema found in  `docs/sql.sql` (default database name is brickbuilder)
4. Update the `./config.js` for your database details


## Notes
[Public Trello board](https://trello.com)


Misc
dnrFunction - do not render, any bricks hidden 2 bricks from edge disposeed from scene  - keep in bricks list.


19-06
Probably should use vuex or something for some state management. IE brick controller between components. IE Bricks / Settings.

04-07-20
Is the Socket/Studio controller naming correct for the backend