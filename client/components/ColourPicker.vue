<template>
  <div class="colour-picker">
    <div class="options" v-if="showColourOptions">

      <div class="button-list">
        <button class="button sm" v-for="colour in brickColours" @click="setColour(colour)" :key="colour.class">
            <span class="colour" :class="colour.class"></span> {{ colour.name }}
        </button>
      </div>
    </div>

    <button class="button" @click="toggleOptions()">
      <span class="colour" :class="colour.class"></span> {{ colour.name }}
    </button>

  </div>
</template>

<script>
import { BrickColours } from "../utils/config";
export default {
  name: "ColourPicker",
  props: [
    "colour",
  ],
  data(){
    return {
      showColourOptions: false,
      brickColours: BrickColours,
      // selectedColour: BrickColours[0],
    }
  },
  mounted() {
    this.colour = BrickColours[0];
  },
  methods: {
    toggleOptions() {
      this.showColourOptions = !this.showColourOptions;
    },
    setColour(colour) {
      this.selectedColour = colour;
      this.toggleOptions(); 
    }
  },
}
</script>

<style>
</style>