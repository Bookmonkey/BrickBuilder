const crypto = require('crypto');
const Studio = require("./Studio");
const db = require("./db");
const StudioController = {
  studios: [],
  async newStudio(info) {
    info.studio_id = await this.generateToken();

    let studio = new Studio(info);

    try {      
      const query = await db.query("INSERT INTO studio(studio_id, is_public, title, colour) values($1, $2, $3, $4);", [
        studio.studio_id,
        studio.public,
        studio.title,
        studio.colour
      ]);
    } catch (error) {
      console.error(error);
    }

    return info.studio_id;
  },
  async getStudios(){
    let studios = [];
    const { rows } = await db.query(`SELECT * FROM studio;`);
    rows.forEach(element => {
      studios.push(new Studio(element));
    });
    return studios;
  },

  async getStudioById(tokenId){
    let studio = this.studios.filter(ele => ele.studio_id === tokenId)[0];

    if(studio === undefined) {
      const { rows } = await db.query(`SELECT * FROM studio where studio_id = $1;`, [tokenId]);
      studio = new Studio(rows[0]);
      this.studios.push(studio);
    }
    return studio;
  },
  getSocketInstanceById(tokenId){

  },

  async deleteStudioById(tokenId){
    const { rows } = await db.query("DELETE FROM studio where studio_id = $1;", [tokenId]);
    console.log(rows);    
    return rows[0];
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