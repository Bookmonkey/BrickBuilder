const db = require("./db");
const API = {

  async getBrickColours() {
    try {
      const { rows } = await db.query("SELECT * FROM brick_colour;");
      return rows;
    } catch (error) {
      console.error(error);
    }
  },
  async getBricks() {
    try {
      const { rows } = await db.query(`SELECT * FROM brick_definition;`);
      return rows;
    } catch (error) {
      console.error(error);
    }

  },

  getStudiosByMemberId() {

  }
}

module.exports =  API;