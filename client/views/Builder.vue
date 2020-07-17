<template>
  <div class="builder-ui">
    <Modal v-show="modalShow" :size="'sm'">
      <div v-show="modalState === 'name'">

        <h2 class="heading">
            Pick a name
        </h2>
          <div class="form-field">
            <input class="full-size" type="text" v-model="name" autofocus />
          </div>

          <button class="button blue" @click="enterStudio(name)">Enter studio</button>
        </div>

        <div v-show="modalState === 'loading'">
          <h2>Loading...</h2>
        </div>
    </Modal>

    <canvas id="renderCanvas"></canvas>

    <div class="brick-ui hidden">
      <div class="tools">
        <div class="dropdown sm">
          <div class="button sm icon-left" @click="brickUIDropdown = !brickUIDropdown">
            <Icon :icon="'menu'"></Icon>
            {{ this.state.selectedBrick.name }}
          </div>

          <div class="items" v-if="brickUIDropdown">
            <!-- <div class="item active icon-left" @click="move()">
              <Icon :icon="'move'"></Icon> Move
            </div> -->

            <div class="item icon-left" @click="rotate()">
              <Icon :icon="'refresh-cw'"></Icon>
              Rotate
            </div>

            <div class="item icon-left disabled">
              <Icon :icon="'droplet'"></Icon>
              Colour
            </div>
          </div>
        </div>
      </div>
    </div>

    <control-panel v-if="state.ui.blockList"></control-panel>

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

      <MyBricks :colours="state.colours" v-if="state.ui.navigation === 'bricks'"></MyBricks>
      <Catalogue :bricks="bricks" v-if="state.ui.navigation === 'catalogue'"></Catalogue>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import io from "socket.io-client";

import Engine from "../builder/Engine";
import BrickController from "../builder/BrickController";
import { Settings, MyBricks, ControlPanel, Catalogue } from "../components";
import Modal from "../components/Modal";

import state from "../state";

import Icon from "../components/Icon";

let socket;

export default Vue.extend({
  components: {
    MyBricks,
    ControlPanel,
    Catalogue,
    Icon,
    Modal
  },
  data() {
    return {
      state: state,
      bricks: [],
      name: "",
      modalShow: true,
      modalState: "name",
      alertShow: false,
      brickUIDropdown: false
    };
  },
  mounted() {
    this.state.studioId = this.$route.params.id;
    this.state.engine = new Engine();    

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
      console.log('abc', data);   

      // this.state.engine.createBrickPiece();
      
      // this.state.brickController.addBrick(data.name, data.colour, brick);
    })


    this.state.socket.on("moveUpdatedBrick", data => {      
      this.state.engine.updateBrickPiece(data);
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

            

            this.state.user.name = name;
            this.state.user.id = socketData.member.userId;

            // TOOD: probably move to state
            this.state.colours = socketData.colours;
            this.state.bricks = socketData.bricks;

            this.state.bricks.map(ele => {
              socketData.member.myBricks.filter(brick => {
                if (ele.id === parseInt(brick)) {
                  this.state.user.bricks.push(ele);
                }
              });
            });

            this.state.engine.intializeFromState(socketData.brickState);
            
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
      let brickUI = document.querySelector('.brick-ui');
      brickUI.classList.toggle('hidden');    
      this.state.selectedBrick = null;
    },

    move(){
      this.state.brickController.UIToggleMove();
    },
    rotate(brickIndex){
      let mesh = this.state.selectedBrick;
      this.state.brickController.UIToggleRotation(mesh);
    }
  }
});
</script>

<style lang="scss" scoped>
</style>