<template>
  <div class="my-bricks">
    <div v-if="state.myBricks.length === 0">
      You havent picked any bricks. Goto the Brick Catalogue to choose some.
    </div>

    <div class="bricks-list">
      <div class="brick" v-for="item in state.myBricks" @click="addBrick(item)" :key="item.id">
        {{ item.title }}
      </div>
    </div>

    <div class="colour-picker" v-if="state.myBricks.length > 0">
      <div class="options" v-if="showColourOptions">
        <div class="form-field">
          <input type="text" placeholder="Search...">
        </div>

        <div class="button-list">
          <button class="button sm" v-for="colour in colours" @click="setColour(colour)" :key="colour.class">
              <span class="lego-colour" :class="colour.css_class"></span> {{ colour.name }}
          </button>
        </div>
      </div>

      <button class="button" @click="toggleOptions()">
        <span class="lego-colour" :class="selectedColour.css_class"></span> {{ selectedColour.name }}
      </button>

    </div>
    
  </div>
</template>

<script>
import state from "../state";
export default {
  name: "Bricks",
  props: ["colours"],
  data() {
    return {
      showColourOptions: false,
      selectedColour: { name: "Bright Red", css_class: "red"},
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