<template>
  <div class="catalogue">
    <div class="header">
      <div class="form-field">
        <input class="full-size" type="text" />
      </div>
    </div>

    <div class="bricks-list">
      <div class="brick" v-for="brick in bricks" @click="toggleToMyBricks(brick, $event)" :key="brick.id">
        <i data-feather="star" v-bind:class="isSelected(brick.id)"></i>
        {{ brick.title }}
      </div>
    </div>

  </div>
</template>

<script>
import state from "../state";
import feather from "feather-icons";

export default {
  name: "Catalogue",
  data() {
    return {
      state: state,
      bricks: state.bricks,
    }
  },
  mounted(){
    feather.replace();    
  },

  methods: {
    isSelected(brickId) {
      let found = false;
      this.state.user.bricks.filter(ele => {
        if(!found && ele.id === brickId) found = true;
      });
    
      return (found) ? 'selected' : '';
    },
    toggleToMyBricks(brickItem, event) {     
      let foundIndex = -1;
  
      this.state.user.bricks.filter((ele, index) => {
        if(ele.id === brickItem.id) foundIndex = index;
      });

      if(foundIndex === -1) {

        fetch(`http://localhost:3000/api/studio/${this.state.studioId}/member/${this.state.user.id}/addbrick/${brickItem.id}`)
        .then(res => res.text())
        .then(res => {
          this.state.user.bricks.push(brickItem);
        });
      }
      else {
        fetch(`http://localhost:3000/api/studio/${this.state.studioId}/member/${this.state.user.id}/removebrick/${brickItem.id}`)
        .then(res => res.text())
        .then(res => {
          console.log(res);
          this.state.user.bricks.splice(foundIndex, 1);
        });
      }

      let bookmarkSVG = event.target.querySelector('.feather-star').classList.toggle('selected');
    }
  }
}
</script>

<style lang="scss">
  .feather-star {
    pointer-events: none;

    &.selected {
      fill: black;
    }
  }
</style>