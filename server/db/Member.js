class Member {
  constructor(member) {
    this.address = member.address;
    this.userId = member.userId;

    this.myBricks = [];
  }

  get getMyBricks() {
    return this.myBricks;
  }

  addToMyBricks(brickId) {
    let exists = this.myBricks.filter(ele => ele === brickId);
    if (exists.length === 0) {
      this.myBricks.push(brickId);
    }
  }

  removeFromMyBricks(brickId) {
    this.myBricks = this.myBricks.filter(ele => ele !== brickId);
  }
}

module.exports = Member;