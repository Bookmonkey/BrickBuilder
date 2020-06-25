class Studio {
    constructor(info) {
        this.id = info.id;
        this.public = info.public;
        this.members = new Array();
        this.title = info.title;
        this.colour = info.colour;
        this.brickState = [];
    }


    addBuilder(info){
        console.log(info);
        this.members.push({
            name: info.name,
            address: info.address
        });
    }
    
    removeBuilderByIp(ip) {
        this.members = this.members.filter(member => member.address !== ip);
    }
}

module.exports = Studio;