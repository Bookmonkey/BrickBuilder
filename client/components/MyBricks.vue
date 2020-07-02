<template>
  <div class="mybricks">
    <div v-if="state.myBricks.length === 0">
      You havent picked any bricks. Goto the Brick Catalogue to choose some.
    </div>

    <div class="bricks-picker">
      <div class="brick" v-for="item in state.myBricks" @click="addBrick(item)" :key="item.id">
        {{ item.title }}
      </div>
    </div>

    <!-- <ColourPicker :colour="brickColour"></ColourPicker> -->

    <!-- <div class="colours"> -->

    <!-- <div class="select" @click="colourDropdown = !colourDropdown">
      <div class="selected-item">
        <span class="colour" :class="brickColour.class"></span> {{ brickColour.name }}
      </div>

      <div class="items" v-if="colourDropdown">
        <div class="item" v-for="colour in brickColours" @click="setColour(colour)" :key="colour">
          <span class="colour" :class="colour.class"></span> {{ colour.name }}
        </div>
      </div>
    </div> -->
    <!-- </div> -->
    
  </div>
</template>

<script>
// import ColourPicker from "./ColourPicker";
import state from "../state";
export default {
  name: "Bricks",
  // components: {
  //   ColourPicker,
  // },
  data() {
    return {
      brickColour: "red",
      colourDropdown: false,
      state: state
    }
  },
  methods: {
    addBrick(brick){
      
      let brickIndex = this.state.brickController.getBrickIndex;
      let brickName = "brick" + brickIndex++;

      let newBrick = this.state.brickController.addBrick(brickName, this.brickColour, brick);
        
      this.state.socket.emit('newBrick', {
          "studioId": this.state.studioId,
          "brickId": newBrick.id,
          "name": newBrick.name,
          "position": newBrick.mesh.position,
          "colour": newBrick.colour
        });
    }
  }
}
</script>

<style>

</style>