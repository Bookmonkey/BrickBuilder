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

      <div class="alert" v-if="alertShow">
        <i data-feather="check-circle"></i> 
        Weclome back <strong>{{ state.user.name }}</strong>
      </div>

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
      state: state,

      name: '',
      modalShow: true,
      alertShow: false
    }    
  },
  mounted() {
    feather.replace();
    this.state.studioId = this.$route.params.id;
    this.state.brickController = new BrickController();

    this.state.socket = io("http://localhost:3000", {
      query: "studioId=" + this.state.studioId
    });

    this.state.user = {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName')
    };

    if(this.state.user.id !== 'null') { 
      fetch(`http://localhost:3000/api/studio/${this.state.studioId}/member/` + this.state.user.id)
      .then(res => res.text())
      .then(res => {
        this.enterStudio(this.state.user.name, this.state.user.id);
        this.welcomeBackMessage()
      });
    }

    this.state.socket.on("isDead", () => {
      this.$router.push("/studios");
    });
  },
  methods: {
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
    enterStudio(name, id) {
      this.modalShow = false;
      fetch("http://localhost:3000/api/studio/" + this.state.studioId)
      .then(res => res.json())
      .then(body => {

        this.state.socket.emit('join', {
          "studioId": this.state.studioId,
          "name": name,
          "id": id
        });

        this.state.socket.on('userJoined', userId => {
          localStorage.setItem('userName', name);
          localStorage.setItem("userId", userId)
        });
      });
    },
    welcomeBackMessage(){

      this.alertShow = true;

      setTimeout(() => {
        this.alertShow = !this.alertShow;
      }, 5000);
    }
  },
});
</script>

<style lang="scss" scoped>
</style>