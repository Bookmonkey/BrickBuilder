class Studio {
    constructor(info) {
        this.id = info.id;
        this.public = info.public;
        this.members = new Array();
        this.title = info.title;
        this.brickState = [];
    }


    addBuilder(info){
        this.members.push({
            name: info.name,
            address: info.address
        });
    }
}

module.exports = Studio;