const crypto = require('crypto');

const StudioController = {
  studios: [],
  async newStudio(info) {
    info.id = await this.generateToken();
    this.studios.push(info);

    return info.id;
  },
  getStudioById(tokenId){

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