<template>
  <div class="bricks">
    <div class="brick" v-for="item in bricks" @click="addBrick(item)" :key="item.id">
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { BrickColours, BrickList } from "../utils/config";
export default {
  name: "Bricks",
  data() {
    return {
      brickColours: BrickColours,
      brickColour: BrickColours[0],
      bricks: BrickList,
    }
  }
}
</script>

<style>

</style>