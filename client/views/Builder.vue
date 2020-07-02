<template>
  <div class="builder-ui">
    <div class="modal" v-show="modalShow">
      <div class="content">

        <div v-show="modalState === 'name'">
          <h2>Pick a name</h2>
          <div class="form-field">
            <input type="text" v-model="name" autofocus />
          </div>

          <button class="button" @click="enterStudio(name)">Enter studio</button>
        </div>

        <div v-show="modalState === 'loading'">
          <h2>Loading...</h2>
        </div>
      </div>
    </div>
    <canvas id="renderCanvas"></canvas>

    <BlockList v-if="state.ui.blockList"></BlockList>

    <div class="alert" v-if="alertShow">
      <i data-feather="check-circle"></i>
      Weclome back
      <strong>{{ state.user.name }}</strong>
    </div>

    <div class="ui">
      <div class="ui-navigation">
        <div class="item" @click="changeUIState('bricks')" :class="isActiveUI('bricks')">My bricks</div>
        <div
          class="item"
          @click="changeUIState('catalogue')"
          :class="isActiveUI('catalogue')"
        >Brick catalogue</div>
        <div
          class="item"
          @click="changeUIState('settings')"
          :class="isActiveUI('settings')"
        >Settings</div>
      </div>

      <MyBricks v-if="state.ui.navigation === 'bricks'"></MyBricks>
      <Catalogue v-if="state.ui.navigation === 'catalogue'"></Catalogue>
      <Settings v-if="state.ui.navigation === 'settings'"></Settings>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import io from "socket.io-client";

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

      name: "",
      modalShow: true,
      modalState: "name",
      alertShow: false
    };
  },
  mounted() {
    feather.replace();
    this.state.studioId = this.$route.params.id;
    this.state.brickController = new BrickController();

    this.state.socket = io("http://localhost:3000", {
      query: "studioId=" + this.state.studioId
    });

    let userId = localStorage.getItem("userId");
    let userName = localStorage.getItem("userName");

    if (this.state.user.id !== "null") {
      fetch(
        `http://localhost:3000/api/studio/${this.state.studioId}/member/` +
          userId
      ).then(res => {
        if (res.status === 200) {
          this.enterStudio(userName, userId);
          this.welcomeBackMessage();

          this.modalState = 'loading';
        }
      });
    }

    this.state.socket.on("isDead", () => {
      this.$router.push("/studios");
    });

    this.state.socket.on("addNewBrick", data => {
      let brick = BrickList.filter(ele => ele.id === data.brickId)[0];
      this.state.brickController.addBrick(data.name, data.colour, brick);
    })


    this.state.socket.on("moveUpdatedBrick", data => {      
      this.state.brickController.updateBrick(data);
    })
  },
  methods: {
    changeUIState(state) {
      this.state.ui.navigation = state;
    },

    isActiveUI(state) {
      return this.state.ui.navigation === state ? "active" : "";
    },
    
    enterStudio(name, id) {
      fetch("http://localhost:3000/api/studio/" + this.state.studioId)
        .then(res => res.json())
        .then(body => {
          this.state.socket.emit("join", {
            studioId: this.state.studioId,
            id: id
          });

          this.state.socket.on("userJoined", socketData => {            
            localStorage.setItem("userName", name);
            localStorage.setItem("userId", socketData.member.userId);

            this.state.user = {
              name: name,
              id: socketData.member.userId
            };

            let bricks = [];

            BrickList.map(ele => {
              socketData.member.myBricks.filter(brick => {
                if (ele.id === parseInt(brick)) {
                  bricks.push(ele);
                }
              });
            });

            this.state.myBricks = bricks;
            this.state.brickState = socketData.brickState;
            this.state.brickController.initializeFromState();
            this.modalShow = false;
          });
        });
    },
    welcomeBackMessage() {
      this.alertShow = true;

      setTimeout(() => {
        this.alertShow = !this.alertShow;
      }, 5000);
    }
  }
});
</script>

<style lang="scss" scoped>
</style>