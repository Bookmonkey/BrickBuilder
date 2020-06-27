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

      <BlockList v-show="state.ui.blockList"></BlockList>

      <div class="ui">
        <div class="ui-navigation">
          <div class="item" @click="changeUIState('bricks')" :class="isActiveUI('bricks')">My bricks</div>
          <div class="item" @click="changeUIState('catalogue')" :class="isActiveUI('catalogue')">Brick catalogue</div>
          <div class="item" @click="changeUIState('settings')" :class="isActiveUI('settings')">Settings</div>
        </div>
        
        <MyBricks v-if="state.ui.navigation === 'bricks'"></MyBricks>
        <Catalogue v-if="state.ui.navigation === 'catalogue'"></Catalogue>
        <Settings v-if="state.ui.navigation === 'settings'"></Settings>
      </div>
    </div>
</template>

<script>
import Vue from "vue";
import io from 'socket.io-client';

import BrickController from "../BrickController";
import { Settings, MyBricks, BlockList, Catalogue } from "../components";

import feather from "feather-icons";

import state from "../state";

import { BrickColours, BrickList } from "../utils/config";
let socket;

export default Vue.extend({
  components: {
    Settings,
    MyBricks,
    BlockList,
    Catalogue
  },
  data() {
    return {
      studioId: null,
      brickController: null,
      brickColours: BrickColours,
      brickColour: BrickColours[0],
      colourDropdown: false,
      bricks: BrickList,

      state: state,

      name: '',
      modalShow: true,

      peopleConnected: 0,
    }    
  },
  mounted() {
    feather.replace();
    this.studioId = this.$route.params.id;
    this.state.brickController = new BrickController();
    socket = io("http://localhost:3000", {
      query: "studioId=" + this.studioId
    });

    socket.on("isDead", () => {
      this.$router.push("/studios");
    });
  },
  methods: {
    addBrick(brickId) {      
        this.brickController.addBrick(brickId);

        socket.emit('newBrick', {
          "studioId": this.studioId,
          "brickId": brickId,
          "brickColour": this.brickController.colour
        });
    },

    changeUIState(state) {
      this.state.ui.navigation = state;
    },

    isActiveUI(state) {
      return (this.state.ui.navigation === state) ? 'active' : '';
    },
  
    setColour(colour) {
      this.brickColour = colour;

      this.brickController.colour = colour.class;
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