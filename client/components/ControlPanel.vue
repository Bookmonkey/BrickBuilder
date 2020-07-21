<template>
  <div class="control-panel">    
    <div class="panel-button button sm icon-left" v-show="!ui.showPanel" @click="toggleShowPanel()">
      <Icon :icon="'menu'"></Icon>
      Control Panel
    </div>
    <div class="panel"  v-show="ui.showPanel">
      <div class="heading">
        <div class="h5">Control Panel</div>
        <div class="dropdown" @click="dropdown = !dropdown">
          <div class="button sm icon-left">
            <Icon :icon="'menu'"></Icon>
            Menu
          </div>
          <div class="items" v-if="dropdown">
            <div class="item icon-left" @click="toggleShowPanel()">
              <Icon :icon="'x-square'"></Icon>
              Hide control panel
            </div>
            <div class="item icon-left" @click="saveStudio()">
              <Icon :icon="'save'"></Icon>
              Save Studio
            </div>
            <div class="item icon-left">
              <Icon :icon="'file'"></Icon>
              Import / Export
            </div>
            <div class="item icon-left" @click="toggleSettings()">
              <Icon :icon="'settings'"></Icon>
              Settings
            </div>
          </div>
        </div>
      </div>

      <div class="content">
      
        <div class="title">
          Sets

          <button class="button sm icon-left">
            <Icon :icon="'plus'"></Icon>
          </button>
        </div>
        <div class="brick-list">
          <div
            
            v-for="(brick, index) in state.brickController.getBricksList"
            :key="index"
            :class="{ brick, selected: isSelectedBrick(brick.name)  }"
          >
            <strong @click="toggleView(index)">{{ brick.name }}</strong>
            <span>{{ formatPosition(index)}}</span>
            <div v-show="brick.open">
              <button class="button sm icon-left" @click="setBrickColour(index, 'green')">
                <Icon :icon="'droplet'" :width="18" :height="18"></Icon>Colour
              </button>

              <button class="button sm icon-left" @click="toggleBrickVisibility(index)">
                <Icon :icon="'eye'" :width="18" :height="18"></Icon>Visibility
              </button>

              <button class="button red sm icon-left" @click="deleteBrick(brick.name)">
                <Icon :icon="'trash'" :width="18" :height="18"></Icon>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel" v-show="ui.showSettings">
      <div class="heading settings">
        <button class="button sm" @click="toggleSettings()">
          <Icon :icon="'arrow-left'"></Icon>
        </button>
        <div class="h5">Settings</div>
      </div>

      <div class="content">
        <div class="h5">Studio</div>
        <div class="form-field">
          <label for="visibility">Visibility</label>
          <select c name="visibility" id="visibility">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div class="form-field">
          <label for="password">Password</label>
          <input class="full-size" type="password" name="password" id="password" />
        </div>
        
        <div class="h5">Interface</div>
        <label for="dol">Direction of Light</label>
        <div class="form-field inline">
          <input type="text" v-model="light.x">
          <input type="text" v-model="light.y">
          <input type="text" v-model="light.z">
        </div>

        <div class="form-field">
          <label for="skybox">Skybox colour</label>
          <input type="text" id="skybox" name="skybox" class="full-size" value="#87CEEB" />
        </div>

        <div class="form-field">
          <label for="ground">Ground colour</label>
          <input type="text" id="ground" name="ground" class="full-size" value="#009900" />
        </div>


        <div class="h5">Dangerous</div>
        <div class="form-field">
          <div class="button red icon-left" @click="deleteStudioPrompt()">
              <i data-feather="trash"></i>        
                Delete studio    
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import state from "../state";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
export default {
  name: "ControlPanel",
  components: {
    Icon,
    Modal
  },
  data() {
    return {
      skyboxHexCode: "#87CEEB",
      groundHexCode: "#87CEEB",
      light: {
        x: 0,
        y: 1,
        z: 0
      },
      ui: {
        showPanel: false,
        showSettings: false,
      },
      showModal: false,
      dropdown: false,
      state: state,
      bricks: []
    };
  },
  methods: {
    
    isSelectedBrick(brickName) {
      let selectedBrick = this.state.selectedBrick;
      if(selectedBrick !== null && selectedBrick.name === brickName) return true;
      else return false;
    },
    
    toggleSettings() {
      this.ui.showSettings = !this.ui.showSettings;
      this.ui.showPanel = !this.ui.showPanel;
    },

    toggleShowPanel() {
      this.ui.showPanel = !this.ui.showPanel;
    },
    toggleView(brickIndex) {
      this.state.brickController.UItoggleOpen(brickIndex);
    },
    toggleBrickVisibility(brickIndex) {
      this.state.brickController.UItoggleVisibility(brickIndex);
    },
    setBrickColour(brickIndex, colour) {
      let brick = state.brickController.getBricksList[brickIndex];
      state.brickController.updateColour(brick.name, brick.mesh, "green");
    },
    deleteBrick(name) {
      this.state.brickController.deleteBrickByName(name);
    },
    formatPosition(brickIndex) {
      let brick = state.brickController.getBricksList[brickIndex];

      let pos = brick.getFormattedPosition;
      return `${pos.x}, ${pos.y}, ${pos.z}`;
    },
        toggleBlockList() {
      this.state.ui.blockList = !this.state.ui.blockList;
    },
    changeLightDirection(){
      this.state.brickController.UIUpdateLight(this.light);
    },

    changeSkybox(){
      this.state.brickController.UIUpdateSkyBoxColour(this.skyboxHexCode);
    },

    changeGround() {
      this.state.brickController.UIUpdateGroundColour(this.groundHexCode);
    },

    deleteStudioPrompt(){
      fetch("http://localhost:3000/api/studio/delete", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.studioId
        }),
      })
      .then(res => {
        this.$router.push("/studios");
      });
    },
    portModal(){
      // console.log("show import/export modal");
    }
  }
};
</script>

<style>
</style>