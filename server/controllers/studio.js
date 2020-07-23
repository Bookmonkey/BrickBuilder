const crypto = require('crypto');
const Studio = require("../Studio");
const db = require("../db");

const SAVE_INTERVAL = 300000; // 5 mins
const StudioController = {
  studios: [],
  saveManager: [],

  async newStudio(info) {
    info.studio_id = await this.generateToken();

    let studio = new Studio(info);

    try {      
      const query = await db.query("INSERT INTO studio(studio_id, is_public, title, colour, direction_light, skybox, ground) values($1, $2, $3, $4, $5, $6, $7);", [
        studio.studio_id,
        studio.public,
        studio.title,
        studio.colour,
        studio.direction_light,
        studio.skybox,
        studio.ground
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

      this.addToSaveManager(studio.studio_id);

      this.studios.push(studio);
    }
    return studio;
  },

  getSocketInstanceById(tokenId){

  },

  async saveStudioStateById(studioId) {
    let studio = await this.getStudioById(studioId);
    const { rows } = await db.query("update studio set brick_state = $1 where studio_id = $2;", [
      JSON.stringify(studio.brickState), 
      studio.studio_id
    ]);

    return rows[0];
  },

  async saveStudioSettingsById(studioId, settings) {
    
    const { rows } = await db.query(`
      update studio set 
      title = $1,
      colour = $2,
      direction_light = $3,
      skybox = $4,
      ground = $5
      where studio_id = $6;`, [
        settings.title,
        settings.colour,
        settings.direction_light,
        settings.skybox,
        settings.ground,
        studioId
    ]);

    let studio = await this.getStudioById(studioId);
    studio.saveSettings(settings);


    return rows[0];
  },


  // TODO: handle if there are no members
  addToSaveManager(studioId) {
    let exists = false;
    this.saveManager.map(ele => {
      if(!exists && ele === studioId) {
        exists = true;
      }
    });

    if(!exists) {
      this.saveManager.push(studioId);

      setInterval(() => {
        this.saveStudioStateById(studioId);
      }, SAVE_INTERVAL);
    }
  },

  async deleteStudioById(tokenId){
    const { rows } = await db.query("DELETE FROM studio where studio_id = $1;", [tokenId]);
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