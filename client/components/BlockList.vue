<template>
  <div class="block-list">
    <div class="heading">
      <div class="h5">Block list</div>
      <div class="button sm" @click="refreshList()">
        <i data-feather="refresh-cw" width="18" height="18"></i>
      </div>
    </div>

    <div class="brick-list">  
      <div v-for="(brick, index) in state.brickController.getBricksList" :key="index" class="brick">
        <strong @click="toggleView(index)">{{ brick.name }}</strong> <span>{{ formatPosition(index)}}</span>
        <div v-show="brick.open">
          <button class="button sm" @click="setBrickColour(index, 'green')">Colour</button>
          <button class="button sm" @click="toggleBrickVisibility(index)">Visibility</button>
          <button class="button red sm" @click="deleteBrick(brick.name)">Delete</button>
        </div>
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
      state: state,
      bricks: []
    }
  },
  methods: {
    toggleView(brickIndex) {
      this.state.brickController.UItoggleOpen(brickIndex);
    },  
    toggleBrickVisibility(brickIndex) {
      this.state.brickController.UItoggleVisibility(brickIndex);
    },
    setBrickColour(brickIndex, colour) {
      let brick = state.brickController.getBricksList[brickIndex];
      state.brickController.updateColour(brick.name, brick.mesh, 'green');
    },
    deleteBrick(name){
      this.state.brickController.deleteBrickByName(name);
    },
    formatPosition(brickIndex) {
      let brick = state.brickController.getBricksList[brickIndex];
      let pos = {
        x: Math.round(brick.mesh.position.x, 2),
        y: Math.round(brick.mesh.position.y, 2),
        z: Math.round(brick.mesh.position.z, 2)
      }
      return `${pos.x}, ${pos.y}, ${pos.z}`;
    }
  },

}
</script>

<style>

</style>