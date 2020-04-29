<template>
    <div class="ui">
      <div class="selected-brick">
        <div id="brick-name">as</div>
      </div>

      <div class="bricks">
        <div class="ui-add" @click="addBrick()" id="ui-add" data-x="1" data-y="1" data-h="10.0">Add 1x1</div>
        <div class="ui-add" id="ui-add" data-x="1" data-y="4" data-h="10.0">Add 1x4</div>
      </div>

      <div class="config">
        <select name="ui-colour" id="ui-colour">
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="black">Black</option>
          <option value="purple">Purple</option>
          <option value="white">White</option>
        </select>
      </div>

      <div class="misc">
        <div class="ui-chat-tab"></div>
        <div class="ui-status">Connected</div>
        <div class="ui-head-count">1 person</div>
      </div>
    </div>
</template>

<script>
import Vue from "vue";

import BrickController from "./BrickController";

const bricks = new BrickController();
export default Vue.extend({
  data() {
    return {
      bundler: "Parcel"
    };
  },
  methods: {
    addBrick() {
        bricks.addBrick();    
    }
  }
});
</script>

<style lang="scss" scoped>
</style>