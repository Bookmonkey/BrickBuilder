<template>
  <div class="block-list">
    <div class="heading">
      <div class="h4">Block list</div>
      <div class="button" @click="refreshList()">
        <i data-feather="refresh-cw"></i>
      </div>
    </div>

    <div class="brick-list" v-if="bricks !== null">  
      <div v-for="(brick, index) in bricks" :key="index" class="brick">
        <strong>{{ brick.name }}</strong> <span>{{ formatPosition(index)}}</span>

        <div @click="setBrickColour(index, 'green')">Set colour</div>
      </div>
    </div>
  </div>
</template>

<script>
import state from "../state";
export default {
  name: "BickList",
  data(){
    return {
      state: state
    }
  },
  methods: {
    refreshList(){
      // this.bricks.map(ele => console.log(ele.brick.position));
    },
    toggleBrickVisibility(brickIndex) {
      let brick = this.bricks[brickIndex];

      brick.mesh.isVisible = !brick.mesh.isVisible;
    },
    setBrickColour(brickIndex, colour) {
      let brick = this.bricks[brickIndex];
      state.brickController.setMaterialColour(brick.mesh, 'green');
    },
    formatPosition(brickIndex) {
      let brick = this.bricks[brickIndex];
      let pos = {
        x: Math.round(brick.mesh.position.x, 2),
        y: Math.round(brick.mesh.position.y, 2),
        z: Math.round(brick.mesh.position.z, 2)
      }
      return `${pos.x}, ${pos.y}, ${pos.z}`;
    }
  },
  computed: {
    bricks: function(){
      if(this.state.brickController === null) {
        return null;
      }
      else {
        return this.state.brickController.getBricksList;
      }
    },
  },
}
</script>

<style>

</style>