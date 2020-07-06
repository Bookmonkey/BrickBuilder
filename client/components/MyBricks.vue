<template>
  <div class="my-bricks">
    <div
      v-if="state.myBricks.length === 0"
    >You havent picked any bricks. Goto the Brick Catalogue to choose some.</div>

    <div class="bricks-list">
      <div
        class="brick"
        v-for="item in state.myBricks"
        @click="addBrick(item)"
        :key="item.id"
      >{{ item.title }}</div>
    </div>

    <div class="colour-picker" v-if="state.myBricks.length > 0">
      <div class="options" v-if="showColourOptions">
        <div class="form-field">
          <input type="text" placeholder="Search..." v-model="colourSearch" autofocus/>
        </div>

        <div class="h5">Colours in use</div>

        <div class="button-list">
          <button
            class="button sm"
            v-for="colour in getColours()"
            @click="setColour(colour)"
            :key="colour.hex_code"
          >
            <span class="lego-colour" :style="{ background: colour.hex_code }"></span>
            {{ colour.name }}
          </button>
        </div>
      </div>

      <button class="button" @click="toggleOptions()">
        <span class="lego-colour" :style="{ background: selectedColour.hex_code }"></span>
        {{ selectedColour.name }}
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
      selectedColour: { name: "Bright Red", hex_code: "#ff0000" },
      state: state,
      filteredColours: this.colours,
      colourSearch: null
    };
  },
  methods: {
    getColours() {
      if(this.colourSearch) {
        return this.filteredColours;
      }
      else return this.colours;
    },
    addBrick(brick) {
      let brickIndex = this.state.brickController.getBrickIndex;
      let brickName = "brick" + brickIndex++;

      let newBrick = this.state.brickController.addBrick(
        brickName,
        this.selectedColour.hex_code,
        brick
      );

      this.state.socket.emit("newBrick", {
        studioId: this.state.studioId,
        brickId: newBrick.id,
        name: newBrick.name,
        position: newBrick.mesh.position,
        colour: newBrick.colour
      });
    },
    toggleOptions() {
      this.showColourOptions = !this.showColourOptions;
    },
    setColour(colour) {
      this.selectedColour = colour;
      this.toggleOptions();
    }
  },
  watch: {
    colourSearch: function(val) {
      this.filteredColours = this.colours.filter(ele => {
        let name = ele.name.toLowerCase();
        val = val.toLowerCase();

        // add lego id and hex code later on
        if (name.indexOf(val) > -1) return ele;
      });
    }
  }
};
</script>