<template>
    <div class="builder-ui">

      <div class="modal" v-show="modalShow">
        <div class="content">
          <h2>Pick a name</h2>
          <div class="form-field">
            <input type="text" v-model="name" />
          </div>

          <button class="button" @click="enterStudio(name)">Enter studio</button>
        </div>
      </div>
      <canvas id="renderCanvas"></canvas>

      <div class="ui">
        <div class="ui-navigation">
          <div class="item" @click="changeUIState('bricks')" :class="isActiveUI('bricks')">Bricks</div>
          <div class="item" @click="changeUIState('settings')" :class="isActiveUI('settings')">Settings</div>
        </div>
        
        <Bricks v-if="uiState === 'bricks'"></Bricks>
        <Settings v-if="uiState === 'settings'"></Settings>
      </div>

      <!-- <div class="brick-picker">
        <div class="selected-brick">
          <div id="brick-name">Bricks</div>
        </div>

        <div class="bricks">
          <div class="ui-add" v-for="item in bricks" @click="addBrick(item)" :key="item.id">
            {{ item.title }}
          </div>
        </div>

        <div class="config">
          <div class="select" @click="colourDropdown = !colourDropdown">
            <div class="selected-item">
              <span class="colour" :class="brickColour.class"></span> {{ brickColour.name }}
            </div>

            <div class="items" v-if="colourDropdown">
              <div class="item" v-for="colour in brickColours" @click="setColour(colour)" :key="colour">
                <span class="colour" :class="colour.class"></span> {{ colour.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="misc">
          <div class="ui-chat-tab"></div>
          <div class="ui-status">Connected</div>
          <div class="ui-head-count">{{ peopleConnected }} person</div>
        </div>
      </div> -->
    </div>
</template>

<script>
import Vue from "vue";
import io from 'socket.io-client';

import BrickController from "../BrickController";
import Settings from "../components/Settings";
import Bricks from "../components/BrickUI";

import { BrickColours, BrickList } from "../utils/config";
let brickController;

let socket;

export default Vue.extend({
  components: {
    Settings,
    Bricks
  },
  data() {
    return {
      studioId: null,
      brickColours: BrickColours,
      brickColour: BrickColours[0],
      colourDropdown: false,
      bricks: BrickList,


      uiState: 'bricks',

      name: '',
      modalShow: true,

      peopleConnected: 0,
    }    
  },
  mounted() {
    this.studioId = this.$route.params.id;
    brickController = new BrickController();
    socket = io("http://localhost:3000", {
      query: "studioId=" + this.studioId
    });

    socket.on("isDead", () => {
      this.$router.push("/studios");
    });
  },
  methods: {
    addBrick(brickId) {      
        brickController.addBrick(brickId);

        socket.emit('newBrick', {
          "studioId": this.studioId,
          "brickId": brickId,
          "brickColour": brickController.colour
        });
    },

    changeUIState(state) {
      this.uiState = state;
    },

    isActiveUI(state) {
      return (this.uiState === state) ? 'active' : '';
    },
  
    setColour(colour) {
      this.brickColour = colour;

      brickController.colour = colour.class;
    },
    enterStudio(name) {
      this.modalShow = false;
      fetch("http://localhost:3000/api/studio/" + this.studioId)
      .then(res => res.json())
      .then(body => {
        // this.peopleConnected = body.members.length;

        socket.emit('join', {
          "studioId": this.studioId,
          "name": name
        });

        this.peopleConnected++;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.select > .selected-item {
  background: white;
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