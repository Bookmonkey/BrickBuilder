const Member = require("./db/Member");

class Studio {
    get getMembers(){
        return this.members;
    }

    constructor(info) {
        this.studio_id = info.studio_id;
        this.public = info.is_public;
        this.members = new Array();
        this.title = info.title;
        this.colour = info.colour;
        this.brickState = [];
    }


    addBuilder(info){
        let member = new Member(info);
        this.members.push(member);
    }
    findBuilderById(userId) {
        let found = false;
        this.members.map(ele => {
            if(!found && ele.userId === userId) found = true;
        });

        return found;
    }

    getBuilderById(userId){
        let member = this.members.filter(ele => ele.userId === userId);
        return member[0]
    }
    
    removeBuilderByIp(ip) {
        this.members = this.members.filter(member => member.address !== ip);
    }

    addBrick(brickInfo) {
        let brick = {
            'name': brickInfo.name,
            'position': brickInfo.position,
            'colour': brickInfo.colour
        }
        this.brickState.push(brick)
    }

    updateBrick(data) {
        this.brickState.map(ele => {
            if(ele.name === data.name) {
                ele[data.type] = data.value
            }
        });
    }
}

module.exports = Studio;