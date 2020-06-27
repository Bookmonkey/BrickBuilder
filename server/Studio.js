class Studio {
    constructor(info) {
        this.studio_id = info.studio_id;
        this.public = info.is_public;
        this.members = new Array();
        this.title = info.title;
        this.colour = info.colour;
        this.brickState = [];
    }


    addBuilder(info){
        this.members.push({
            name: info.name,
            address: info.address
        });

        console.log(this.members);
    }
    
    removeBuilderByIp(ip) {
        this.members = this.members.filter(member => member.address !== ip);
    }
}

module.exports = Studio;