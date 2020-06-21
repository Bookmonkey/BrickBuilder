const crypto = require('crypto');
const Studio = require("./Studio");
const db = require("./db");
const StudioController = {
  studios: [],
  async newStudio(info) {
    info.id = await this.generateToken();

    let studio = new Studio(info);

    try {      
      const query = await db.query("INSERT INTO studio(studio_id, is_public, title) values($1, $2, $3);", [
        studio.id,
        studio.public,
        studio.title
      ]);
    } catch (error) {
      console.error(error);
    }

    // this.studios.push(studio);
    return info.id;
  },
  async getStudios(){
    const { rows } = await db.query(`SELECT * FROM studio;`);
    return rows;    
  },
  async getStudioById(tokenId){
    const { rows } = await db.query(`SELECT * FROM studio where studio_id = $1`, [tokenId]);
    return rows[0];
  },
  getSocketInstanceById(tokenId){

  },

  deleteStudioById(tokenId){

  },

  deleteInactiveStudios(){},

  
  generateToken() {
    return new Promise(function(resolve, reject) {
      crypto.randomBytes(12, (err, buffer) => {
        if (err) {
          reject("error generating token");
        }
        const token = buffer.toString('hex');
        resolve(token);
      });
    });
  }
}

module.exports =  StudioController;