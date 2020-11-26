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

    <control-panel></control-panel>

    <div class="alert blue" v-if="alertShow">
      <Icon :icon="'check-circle'"></Icon>Weclome back
      <strong>{{ state.user.name }}</strong>
    </div>


    <div class="alert" v-if="debugMode">
      You're in debug mode!
    </div>

    <div class="ui" :class="state.ui.mode">
      <div class="button-list" v-show="isActiveNavItem('menu')">
        <button class="button icon-left" @click="showAddBricks()">
          <Icon :icon="'plus-square'"></Icon>Add
        </button>

        <button class="button icon-left" @click="setNavigation('edit-bricks')">
          <Icon :icon="'edit-2'"></Icon>Edit
        </button>

        <button class="button icon-left" @click="setNavigation('catalog')">
          <Icon :icon="'book-open'"></Icon>Catalogue
        </button>

        <!-- <div class="button icon-left" @click="showColourOptions()">
          <Icon :icon="'droplet'"></Icon>Colour
        </div>-->

        <button class="button icon-left disabled" @click="setNavigation('settings')" disabled>
          <Icon :icon="'info'"></Icon> Help
        </button>

        <button class="button icon-left" @click="setNavigation('settings')">
          <Icon :icon="'settings'"></Icon>Settings
        </button>
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
          <div class="button icon-left" :class="isActiveMode('move')" @click="changeMode('move')">
            <Icon :icon="'move'"></Icon>Move
          </div>

          <button
            class="button icon-left"
            :class="isActiveMode('paint')"
            @click="changeMode('paint')"
          >
            <Icon :icon="'droplet'"></Icon>Repaint
          </button>
          <ColourPicker></ColourPicker>
        </div>
      </div>

      <div v-if="state.ui.navigation === 'catalog'">
        <button class="button sm unstyled" @click="gotoMenu()">
          <Icon :icon="'arrow-left'"></Icon>
        </button>
        <Catalogue :bricks="bricks"></Catalogue>
      </div>

      <div class="settings-ui" v-if="state.ui.navigation === 'settings'">
        <div class="heading">
          <button class="button sm unstyled" @click="gotoMenu()">
            <Icon :icon="'arrow-left'"></Icon>
          </button>
          Settings
        </div>

        <div class="ui-navigation">
          <div class="item" @click="setSettingsUI('interface')">Interface</div>
          <div class="item" @click="setSettingsUI('admin')">Admin</div>
        </div>

        <div class="setting-panel" v-if="settingsUI === 'interface'">
          <div class="form-field">
            <label for="showBrickList">
              Show brick list
              <input type="checkbox" name="showBrickList" id="showBrickList" @click="toggleSetting('showBrickList')" />
            </label>
          </div>
          <div class="form-field" >
            <label for="debug">
              Show debug mode
              <input type="checkbox" name="debug" id="debug" @click="toggleSetting('debugMode')"/>
            </label>
          </div>

          <div class="form-field">
            <label for="soundEffects">
              Play sound effects
              <input type="checkbox" name="soundEffects" id="soundEffects" @click="toggleSetting('playSoundEffects')"/>
            </label>
          </div>

          <div class="form-field inline">
            
            <label for="groundSize" class="full-size">Size of Ground</label>
            <input type="text" id="groundSizeX" name="groundSizeX" v-model="state.studioInfo.groundSize.x" disabled />
            <input type="text" id="groundSizeY" name="groundSizeY" v-model="state.studioInfo.groundSize.y" disabled />
          </div>

          <div class="form-field">
            <label for="skybox">Skybox colour</label>
            <input
              type="text"
              id="skybox"
              name="skybox"
              class="full-size"
              v-model="state.studioInfo.skybox"
            />
          </div>

          <div class="form-field">
            <label for="ground">Ground colour</label>
            <input
              type="text"
              id="ground"
              name="ground"
              class="full-size"
              v-model="state.studioInfo.ground"
            />
          </div>

          <div class="form-field">
            <button class="button icon-left" @click="updateInterfaceSettings()">
              <Icon :icon="'save'"></Icon>
              Update settings
            </button>
          </div>
        </div>

                <div class="setting-panel" v-if="settingsUI === 'admin'">
          <h5 class="h5">Studio</h5>
          <div class="form-field">
            <label for="studioName">Studio name</label>
            <input
              class="full-size"
              type="studioName"
              name="studioName"
              id="studioName"
              v-model="state.studioInfo.title"
            />
          </div>

          <div class="form-field">
            <label for="visibility">Visibility</label>
            <select class="full-size" name="visibility" id="visibility">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div class="form-field">
            <label for="colour">Studio colour</label>
            <select class="full-size" id="colour" name="colour" v-model="state.studioInfo.colour">
              <option value="black">Black</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
            </select>
          </div>

          <div class="form-field">
            <label for="password">Password</label>
            <input class="full-size" type="password" name="password" id="password" />
          </div>


          <div class="form-field">
            <div class="button red icon-left" @click="deleteStudioPrompt()">
                <Icon :icon="'trash'"></Icon> 
                Delete studio
              </div>
          </div>
          
        </div>
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
    ColourPicker,
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

      settingsUI: "interface",
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
      Engine.renderNewBrick(data, "brickId");
    });

    this.state.socket.on("moveUpdatedBrick", (data) => {
      // this.state.engine.updateBrickPiece(data);
    });

    this.state.socket.on("removeBrick", (data) => {
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

    setNavigation(nav) {
      this.state.ui.navigation = nav;
    },

    changeMode(mode) {
      this.state.ui.mode = mode;
    },

    isActiveMode(mode) {
      return this.state.ui.mode === mode ? "active" : "";
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

    setSettingsUI(ui) {
      this.settingsUI = ui;
    },

    toggleSetting(setting){
      this.state.ui[setting] = !this.state.ui[setting];
      Engine.settingToggleUpdate(setting);
    },

    updateInterfaceSettings(){
      let info = {
        skybox: state.studioInfo.skybox,
        ground: state.studioInfo.ground,
        groundSize: state.studioInfo.groundSize // refactor
      };

      Engine.interfaceSettingsUpdate(info);
    },
    updateStudioSettings() {
      console.log("update studio settings")
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
            groundSize: {
              x: 0,
              y: 0
            }
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
      this.alertShow = true;
      setTimeout(() => {
        this.alertShow = !this.alertShow;
      }, 5000);
    },

    closeBrickUI() {
      let brickUI = document.querySelector(".brick-ui");
      brickUI.classList.toggle("hidden");
      this.state.selectedBrick = null;
    },

    deleteStudioPrompt() {
      fetch("http://localhost:3000/api/studio/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.state.studioId,
        }),
      }).then((res) => {
        this.$router.push("/studios");
      });
    },
  },

  computed: {
    currentMode: function () {
      return this.state.ui.mode;
    },
    debugMode: function() {
      return this.state.ui.debugMode;
    }
  },
});
</script>

<style lang="scss" scoped>
</style>