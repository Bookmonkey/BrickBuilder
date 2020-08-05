const Member = require("./db/Member");

class Studio {
    get getMembers(){
        return this.members;
    }

    get getBrickState() {
        return this.brickState;
    }

    constructor(info) {
        this.studio_id = info.studio_id;
        this.public = info.is_public;
        this.members = new Array();
        this.title = info.title;
        this.colour = info.colour;
        this.direction_light = info.direction_light;
        this.skybox = info.skybox;
        this.ground = info.ground;

        if(info.brick_state) {
            this.brickState = info.brick_state;
        }
        else this.brickState = [];
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
            'id': brickInfo.brickId,
            'name': brickInfo.name,
            'position': brickInfo.position,
            'colour': brickInfo.colour
        }
        
        this.brickState.push(brick)
    }

    removeBrick(brickName) {
        this.brickState = this.brickState.filter(ele => ele.name === brickName);
    }

    updateBrick(data) {
        this.brickState.map(ele => {
            if(ele.name === data.name) {
                ele[data.type] = data.value
            }
        });
    }

    saveSettings(settings){
        this.title = settings.title;
        this.colour = settings.colour;
        this.direction_light = settings.direction_light;
        this.skybox = settings.skybox;
        this.ground = settings.ground;
    }
}

module.exports = Studio;