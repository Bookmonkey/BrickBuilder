<template>
  <div class="control-panel">

    <Modal v-show="showModal">
      <h3>Settings for Studio</h3>
      <div class="settings">
        <div class="h5">Studio</div>
        <div class="option">
          <div class="form-field">
            <label for="password">Password</label>
            <input type="password" name="password" id="password">
          </div>
        </div>
        <div class="h5">Interface</div>
        <div class="option">
          <div class="title">Direction of Light</div>
          <div class="form-field inline">
            <input type="text">
            <input type="text">
            <input type="text">

            <button class="button">Update</button>
          </div>

        </div>
        <div class="option">

          <div class="title">Skybox colour</div>
          <div class="form-field inline">
            <input type="text">
            <button class="button">Update</button>
          </div>
        </div>

        <div class="h5">Dangerous - This is dangerous. Beware.</div>

        <div class="option">
          <div class="form-field">
            
            <div class="button red icon-left" @click="deleteStudioPrompt()">
              <i data-feather="trash"></i>        
                Delete studio    
            </div>
          </div>
        </div>
      </div>
    </Modal>
    
    <div class="button" v-show="!ui.showPanel" @click="toggleShowPanel()">Show panel</div>
    <div class="panel">
      <div class="heading">
        <div class="h5">Control Panel</div>
        <div class="dropdown" @click="dropdown = !dropdown">
          <div class="button sm">
            <Icon :icon="'menu'"></Icon>
          </div>
          <div class="items" v-if="dropdown">
            <div class="item" @click="toggleShowPanel()">
              <Icon :icon="'file'"></Icon>
              Hide control panel
            </div>
            <div class="item">
              <Icon :icon="'file'"></Icon>
              Import / Export
            </div>
            <div class="item" @click="showModal = true">
              <Icon :icon="'settings'"></Icon>
              Settings
            </div>
          </div>
        </div>
      </div>

      <div class="content">
      
        <div class="h5">Sets</div>
        <div class="brick-list">
          <div
            v-for="(brick, index) in state.brickController.getBricksList"
            :key="index"
            class="brick"
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
      ui: {
        showPanel: false
      },
      showModal: false,
      dropdown: false,
      state: state,
      bricks: []
    };
  },
  methods: {
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
      this.state.brickController.UIUpdateLight();
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