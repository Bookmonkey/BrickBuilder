class Member {
    constructor(member){
        this.address = member.address;
        this.userId = member.userId;

        this.myBricks = [];
    }

    get getMyBricks(){
        return this.myBricks;
    }

    addToMyBricks(myBrick){

        let exists = this.myBricks.filter(ele => ele === myBrick);
        console.log(exists.length)
        if(exists.length === 0){
            this.myBricks.push(myBrick);
        }
    }
}

module.exports = Member;