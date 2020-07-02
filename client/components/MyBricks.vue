<template>
  <div class="mybricks">
    <div v-if="state.myBricks.length === 0">
      You havent picked any bricks. Goto the Brick Catalogue to choose some.
    </div>

    <div class="bricks-list">
      <div class="brick" v-for="item in state.myBricks" @click="addBrick(item)" :key="item.id">
        {{ item.title }}
      </div>
    </div>

    <div class="colour-picker">
      <div class="options" v-if="showColourOptions">

        <div class="button-list">
          <button class="button sm" v-for="colour in brickColours" @click="setColour(colour)" :key="colour.class">
              <span class="colour" :class="colour.class"></span> {{ colour.name }}
          </button>
        </div>
      </div>

      <button class="button" @click="toggleOptions()">
        <span class="colour" :class="selectedColour.class"></span> {{ selectedColour.name }}
      </button>

    </div>
    
  </div>
</template>

<script>
import state from "../state";
import { BrickColours } from '../utils/config';
export default {
  name: "Bricks",
  data() {
    return {
      showColourOptions: false,
      brickColours: BrickColours,
      selectedColour: BrickColours[0],
      state: state
    }
  },
  methods: {
    addBrick(brick){
      
      let brickIndex = this.state.brickController.getBrickIndex;
      let brickName = "brick" + brickIndex++;

      let newBrick = this.state.brickController.addBrick(brickName, this.selectedColour.class, brick);
        
      this.state.socket.emit('newBrick', {
          "studioId": this.state.studioId,
          "brickId": newBrick.id,
          "name": newBrick.name,
          "position": newBrick.mesh.position,
          "colour": newBrick.colour
        });
    },
    toggleOptions() {
      this.showColourOptions = !this.showColourOptions;
    },
    setColour(colour) {
      this.selectedColour = colour;
      this.toggleOptions(); 
    }
  }
}
</script>

<style>

</style>