<template>
  <div class="my-bricks">
    <div
      v-if="state.user.bricks.length === 0"
    >You havent picked any bricks. Goto the Brick Catalogue to choose some.</div>

    <div class="bricks-list">
      <div
        class="brick"
        :class="{ 'selected': isSelectedBrick(item.id) }"
        v-for="item in state.user.bricks"
        @click="selectBrick(item.id)"
        :key="item.id"
      >{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import state from "../state";
import Engine from "../builder/Engine";

export default {
  name: "Bricks",
  props: ["colours"],
  data() {
    return {
      selectedBrickId: null,
      showColourOptions: false,
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
    isSelectedBrick(id) {
      return (id === this.selectedBrickId) ? true : false;
    },
    selectBrick(brickIndex) {
      this.selectedBrickId = brickIndex;
      Engine.setBrickDefinition(brickIndex);
    },
    toggleOptions() {
      this.showColourOptions = !this.showColourOptions;
    },
    setColour(colour) {
      Engine.setBrickColour(colour);
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