const { Pool } = require('pg')
const { database } = require("../../config");
const pool = new Pool(database);
module.exports = {
  query: (text, params) => pool.query(text, params)
}