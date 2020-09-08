<template>
  <div class="builder-ui">
    <Modal v-show="modalShow" :size="'sm'">
      <div v-show="modalState === 'name'">
        <h2 class="heading">Pick a name</h2>
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
            <div class="item icon-left" @click="rotate()">
              <Icon :icon="'refresh-cw'"></Icon>Rotate
            </div>

            <div class="item icon-left disabled">
              <Icon :icon="'droplet'"></Icon>Colour
            </div>
          </div>
        </div>
      </div>
    </div>

    <control-panel v-if="state.ui.blockList"></control-panel>

    <div class="alert" v-if="alertShow">
      <Icon :icon="'check-circle'"></Icon>Weclome back
      <strong>{{ state.user.name }}</strong>
    </div>

    <div class="ui" :class="state.ui.mode">
      <div class="button-list" v-show="isActiveNavItem('menu')">
        <div class="button icon-left" @click="showAddBricks()">
          <Icon :icon="'plus-square'"></Icon>Add
        </div>

        <div class="button icon-left" @click="showEditBricks()">
          <Icon :icon="'edit-2'"></Icon>Edit
        </div>

        <div class="button icon-left" @click="gotoCatalog()">
          <Icon :icon="'book-open'"></Icon>Catalogue
        </div>

        <div class="button icon-left" @click="showColourOptions()">
          <Icon :icon="'droplet'"></Icon>Colour
        </div>

        <div class="button icon-left">
          <Icon :icon="'settings'"></Icon>Settings
        </div>
      </div>

      <div v-show="isActiveNavItem('add-bricks')">
        <div class="button-list">
          <button class="button unstyled" @click="gotoMenu()">
            <Icon :icon="'arrow-left'"></Icon>
          </button>
        
          <div v-if="state.user.bricks.length === 0">No bricks added</div>

          <div
            class="button"
            :class="{ 'selected': isSelectedBrick(item.id) }"
            v-for="item in state.user.bricks"
            @click="selectBrick(item.id)"
            :key="item.id"
          >{{ item.title }}</div>

          <ColourPicker></ColourPicker>
        </div>

      </div>
      <div v-show="isActiveNavItem('edit-bricks')">
        <div class="button-list">
          <button class="button unstyled" @click="gotoMenu()">
            <Icon :icon="'arrow-left'"></Icon>
          </button>

          <div
          class="button icon-left"
            :class="isActiveMode('remove')"
            @click="changeMode('remove')"
          >
            <Icon :icon="'minus-square'"></Icon>Remove
          </div>
          <div class="button icon-left" @click="changeMode('move')">
            <Icon :icon="'move'"></Icon>Move
          </div>
        </div>
      </div>


      <div v-show="isActiveNavItem('colour-options')">
        <div class="button-list">
          <button class="button unstyled" @click="gotoMenu()">
            <Icon :icon="'arrow-left'"></Icon>
          </button>

          <button class="button" @click="changeMode('paint')">Repaint</button>

          <ColourPicker></ColourPicker>
        </div>

      </div>

      <div v-if="state.ui.navigation === 'catalog'">
        <button class="button sm unstyled" @click="gotoMenu()">
          <Icon :icon="'arrow-left'"></Icon>
        </button>
        <Catalogue :bricks="bricks"></Catalogue>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import io from "socket.io-client";

import Engine from "../builder/Engine";
import { MyBricks, ControlPanel, Catalogue, Icon, Modal } from "../components";
import ColourPicker from "../components/ColourPicker";

import state from "../state";
import { log } from "three";

let socket;

export default Vue.extend({
  components: {
    MyBricks,
    ControlPanel,
    Catalogue,
    Icon,
    Modal,
    ColourPicker
  },
  data() {
    return {
      state: state,
      bricks: [],
      name: "",
      modalShow: true,
      modalState: "name",
      alertShow: false,
      brickUIDropdown: false,
      selectedBrickId: 0,
    };
  },
  mounted() {
    this.state.studioId = this.$route.params.id;

    this.state.socket = io("http://localhost:3000", {
      query: "studioId=" + this.state.studioId,
    });

    let userId = localStorage.getItem("userId");
    let userName = localStorage.getItem("userName");

    if (this.state.user.id !== "null") {
      fetch(
        `http://localhost:3000/api/studio/${this.state.studioId}/member/` +
          userId
      ).then((res) => {
        if (res.status === 200) {
          this.enterStudio(userName, userId);
          this.welcomeBackMessage();

          this.modalState = "loading";
        }
      });
    }

    this.state.socket.on("isDead", () => {
      this.$router.push("/studios");
    });

    this.state.socket.on("addNewBrick", (data) => {
      Engine.renderNewBrick(data, 'brickId');

      // this.state.engine.createBrickPiece();

      // this.state.brickController.addBrick(data.name, data.colour, brick);
    });

    this.state.socket.on("moveUpdatedBrick", (data) => {
      // this.state.engine.updateBrickPiece(data);
    });


    this.state.socket.on("removeBrick", data => {
      Engine.unrenderBrick(data.brickName);
    });
  },
  methods: {
    gotoMenu() {
      Engine.deselect();
    },
    showAddBricks() {
      this.state.ui.mode = "add";
      this.state.ui.navigation = "add-bricks";
    },
    showEditBricks() {
      // this.state.ui.mode = 'edit';
      this.state.ui.navigation = "edit-bricks";
    },

    showColourOptions() {
      this.state.ui.navigation = 'colour-options';
    },

    gotoCatalog() {
      this.state.ui.navigation = "catalog";
    },

    changeMode(mode) {
      this.state.ui.mode = mode;
      // Engine.setMode(state);
    },

    isActiveMode(state) {
      return this.state.ui.state === state ? "active  " : "";
    },

    isActiveNavItem(navItem) {
      return this.state.ui.navigation === navItem ? true : false;
    },

    isSelectedBrick(id) {
      return id === this.selectedBrickId ? true : false;
    },
    selectBrick(brickIndex) {
      this.selectedBrickId = brickIndex;
      Engine.setBrickDefinition(brickIndex);
    },

    enterStudio(name, id) {
      fetch("http://localhost:3000/api/studio/" + this.state.studioId)
        .then((res) => res.json())
        .then((body) => {
          this.state.socket.emit("join", {
            studioId: this.state.studioId,
            id: id,
          });

          this.state.studioInfo = {
            title: body.title,
            colour: body.colour,
            direction_light: body.direction_light,
            skybox: body.skybox,
            ground: body.ground,
          };

          this.state.socket.on("userJoined", (socketData) => {
            localStorage.setItem("userName", name);
            localStorage.setItem("userId", socketData.member.userId);

            this.state.user.name = name;
            this.state.user.id = socketData.member.userId;

            this.state.colours = socketData.colours;
            this.state.bricks = socketData.bricks;

            this.state.bricks.map((ele) => {
              socketData.member.myBricks.filter((brick) => {
                if (ele.id === parseInt(brick)) {
                  this.state.user.bricks.push(ele);
                }
              });
            });

            // this.state.engine.intializeFromState(socketData.brickState);

            this.modalShow = false;
            Engine.init(socketData.brickState);
          });
        });
    },
    welcomeBackMessage() {
      // this.alertShow = true;
      // setTimeout(() => {
      //   this.alertShow = !this.alertShow;
      // }, 5000);
    },

    closeBrickUI() {
      let brickUI = document.querySelector(".brick-ui");
      brickUI.classList.toggle("hidden");
      this.state.selectedBrick = null;
    },

    // move(){
    //   this.state.brickController.UIToggleMove();
    // },
    // rotate(brickIndex){
    //   let mesh = this.state.selectedBrick;
    //   this.state.brickController.UIToggleRotation(mesh);
    // }
  },

  computed: {
    currentMode: function () {
      return this.state.ui.mode;
    },
  },
});
</script>

<style lang="scss" scoped>
</style>