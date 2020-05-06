<template>
    <div class="ui">
        <div class="settings">
          <img src="images/settings.svg"/>
        </div>
      <div class="brick-picker">
        <div class="selected-brick">
          <div id="brick-name">Bricks
          </div>
        </div>

        <div class="bricks">
          <div class="ui-add" v-for="item in bricks" @click="addBrick(item)">
            {{ item.title }}
          </div>
        </div>

        <div class="config">
          <div class="select" @click="colourDropdown = !colourDropdown">
            <div class="selected-item">
              <span class="colour" :class="brickColour.class"></span> {{ brickColour.name }}
            </div>

            <div class="items" v-if="colourDropdown">
              <div class="item" v-for="colour in brickColours" @click="setColour(colour)">
                <span class="colour" :class="colour.class"></span> {{ colour.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="misc">
          <div class="ui-chat-tab"></div>
          <div class="ui-status">Connected</div>
          <div class="ui-head-count">1 person</div>
        </div>
      </div>
    </div>
</template>

<script>
import Vue from "vue";

import BrickController from "./BrickController";
import { BrickColours, BrickList } from "./utils/config";


const brickController = new BrickController();
export default Vue.extend({
  data() {
    return {
      brickColours: BrickColours,
      brickColour: BrickColours[0],
      colourDropdown: false,
      bricks: BrickList,
    }    
  },
  methods: {
    addBrick(brickId) {      
        brickController.addBrick(brickId);
    },
    setColour(colour) {
      this.brickColour = colour;

      brickController.colour = colour.class;
    }
  },
});
</script>

<style lang="scss" scoped>
.button,
.select > .selected-item {
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px #d1d5da;
  padding: 12px 24px;
  font-size: 16px;

  display: inline-block;
  cursor: pointer;
}

.select::hover, .button::hover {
  background: #fff;
}


.select > .items {
  display: block;
  position: absolute;
  bottom: 60px;
  width: 130px;
  box-shadow: inset 0 0 0 1px #d1d5da;
  background: white;
}

.select .items .item {
  padding: 6px;
}

.select .items .item:hover {
  background: #d1d5da;
}


.colour {
  border-radius: 50%;
  margin-right: 4px;
  display: inline-block;
  width: 12px;
  height: 12px;
}

.colour.red {
  background: red;
}

.colour.blue {
  background: blue;
}
.colour.green {
  background: green;
}
.colour.yellow {
  background: yellow;
}
.colour.black {
  background: black;
}

</style>