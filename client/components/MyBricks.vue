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
  </div>
</template>

<script>
import { BrickColours, BrickList } from "../utils/config";
import state from "../state";
export default {
  name: "Bricks",
  data() {
    return {
      brickColours: BrickColours,
      brickColour: BrickColours[0],
      state: state,
    }
  },
  methods: {
    addBrick(brick){
      this.state.brickController.addBrick(brick);      
    }
  }
}
</script>

<style>

</style>