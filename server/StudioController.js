const crypto = require('crypto');
const Studio = require("./Studio");
const StudioController = {
  studios: [],
  async newStudio(info) {
    info.id = await this.generateToken();

    let studio = new Studio(info);
    this.studios.push(studio);
    return info.id;
  },
  getStudios(){
    return this.studios;
  },
  getStudioById(tokenId){
    return this.studios.filter(ele=> ele.id = tokenId)[0];
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