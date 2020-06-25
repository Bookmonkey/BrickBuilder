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
</style>