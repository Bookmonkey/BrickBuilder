<template>
  <div class="builder-ui">
    <div class="modal" v-show="modalShow">
      <div class="content">

        <div v-show="modalState === 'name'">
          <h2>Pick a name</h2>
          <div class="form-field">
            <input class="full-size" type="text" v-model="name" autofocus />
          </div>

          <button class="button" @click="enterStudio(name)">Enter studio</button>
        </div>

        <div v-show="modalState === 'loading'">
          <h2>Loading...</h2>
        </div>
      </div>
    </div>
    <canvas id="renderCanvas"></canvas>

    <div class="brick-ui hidden">
      <div class="tools">
        <div class="button-list">
          <div class="button sm" @click="move()">
            <Icon :icon="'move'"></Icon>
          </div>
          <div class="button sm" @click="rotate()">
            <Icon :icon="'refresh-cw'"></Icon>
          </div>

          <div class="button sm">
            <Icon :icon="'droplet'"></Icon>
          </div>
        </div>
      </div>

      <div class="close">
        <div class="button sm" @click="closeBrickUI()">
          <Icon :icon="'x-circle'"></Icon>
        </div>
      </div>
    </div>

    <BlockList v-if="state.ui.blockList"></BlockList>

    <div class="alert" v-if="alertShow">
      <Icon :icon="'check-circle'"></Icon>
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
      </div>

      <MyBricks :colours="colours" v-if="state.ui.navigation === 'bricks'"></MyBricks>
      <Catalogue :bricks="bricks" v-if="state.ui.navigation === 'catalogue'"></Catalogue>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import io from "socket.io-client";

import BrickController from "../BrickController";
import { Settings, MyBricks, BlockList, Catalogue } from "../components";

import state from "../state";

import Icon from "../components/Icon";

let socket;

export default Vue.extend({
  components: {
    MyBricks,
    BlockList,
    Catalogue,
    Icon
  },
  data() {
    return {
      state: state,
      colours: [],
      bricks: [],
      name: "",
      modalShow: true,
      modalState: "name",
      alertShow: false
    };
  },
  mounted() {
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
      let brick = this.state.bricks.filter(ele => ele.id === data.brickId)[0];
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

            // TOOD: probably move to state
            this.colours = socketData.colours;
            this.state.bricks = socketData.bricks;

            let myBricks = [];

            this.state.bricks.map(ele => {
              socketData.member.myBricks.filter(brick => {
                if (ele.id === parseInt(brick)) {
                  myBricks.push(ele);
                }
              });
            });

            this.state.myBricks = myBricks;
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
    },

    closeBrickUI() {
      // this.state.brickController
      let brickUI = document.querySelector('.brick-ui');
      brickUI.classList.toggle('hidden');    
    },

    move(){
      this.state.brickController.UIToggleMove();
    },
    rotate(){
      this.state.brickController.UIToggleRotation();
    }
  }
});
</script>

<style lang="scss" scoped>
</style>