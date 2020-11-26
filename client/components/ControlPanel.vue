<template>
  <div class="control-panel">
    <div class="panel" v-show="showPanel">
      <div v-show="uiState === 'panel'">
        <div class="heading">
          <div class="h5">Control Panel</div>
        </div>

        <div class="content">

          <div class="button icon-left" @click="saveStudio()">
            <Icon :icon="'save'"></Icon>Save Studio
          </div>
          <div class="button icon-left" @click="toggleView('port')">
            <Icon :icon="'file'"></Icon>Import / Export
          </div>
          
          <div class="title">
            Sets
            <button class="button sm icon-left">
              <Icon :icon="'plus'"></Icon>
            </button>
          </div>

          <div class="brick-list">
            <div
              v-for="(brick, index) in brickList"
              :key="index"
              :class="{brick, selected: isSelectedBrick(brick.name)}"
            >
              <div class="title">{{ brick.name }} ({{ brick.position }})</div>

              <button class="button sm icon-right" @click="toggleView('brick', brick.name)">
                View
                <Icon :icon="'chevron-right'"></Icon>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="uiState === 'settings'">
        <div class="heading">
          <button class="button sm" @click="toggleView('panel')">
            <Icon :icon="'arrow-left'"></Icon>
          </button>
          <div class="h5">Settings</div>
        </div>
      </div>

      <div v-show="uiState === 'brick'">
        <div class="heading">
          <button class="button sm" @click="toggleView('panel')">
            <Icon :icon="'arrow-left'"></Icon>
          </button>
          <div class="h5">{{ selectedBrick.name }}</div>
        </div>

        <div class="content">
          <div class="form-field">
            <label for="name">Name</label>
            <input type="text" class="full-size" v-model="selectedBrick.name" />
          </div>

          <div class="button-list">
            <button class="button sm" @click="toggleVisibility()">Visibility</button>
            <button class="button red sm" @click="deleteBrick()">Delete Brick</button>
          </div>
        </div>
      </div>

      <div v-show="uiState === 'port'">
        <div class="heading">
          <button class="button sm" @click="toggleView('panel')">
            <Icon :icon="'arrow-left'"></Icon>
          </button>
          <div class="h5">Import / Export</div>
        </div>

        <div class="content">
          <div class="form-field">
            <label for="import">Import</label>
            <input type="file" name="import" id="import" class="full-size" />
          </div>

          <div class="form-field">
            <label for="export">Export</label>
            <button class="button sm icon-right" @click="exportFile()">
              Download file
              <Icon :icon="'download'"></Icon>
            </button>
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
import Engine from "../builder/Engine";
export default {
  name: "ControlPanel",
  components: {
    Icon,
    Modal,
  },
  data() {
    return {
      skyboxHexCode: "#87CEEB",
      groundHexCode: "#87CEEB",
      light: {
        x: 0,
        y: 1,
        z: 0,
      },

      uiState: "panel",

      selectedBrick: [],
      
      showModal: false,

      dropdown: false,
      state: state,
    };
  },
  mounted(){
    // console.log(Engine.brickController);
  },
  computed: {
    brickList: function () {
      return Engine.getBrickList();
      // if (this.state.engine === null) return [];
      // else return Engine.getBrickList();
    },
    showPanel: function(){
      return this.state.ui.showBrickList;
    },
  },
  methods: {
    isSelectedBrick(brickName) {
      let selectedBrick = this.state.selectedBrick;
      if (selectedBrick !== null && selectedBrick.name === brickName)
        return true;
      else return false;
    },

    hideControlPanel() {
      this.showPanel = false;
    },
    showControlPanel() {
      this.showPanel = true;
      this.uiState = "panel";
    },

    toggleView(view, brickName) {
      this.uiState = view;

      if (brickName) {
        let brick = state.engine.brickController.getBrickByName(brickName);

        this.selectedBrick = brick;
      }
    },
    toggleDebugMode() {
      this.state.engine.toggleDebugMode();
    },

    toggleAccordan(key) {
      this.accordan[key] = !this.accordan[key];
    },

    toggleVisibility() {
      let brick = state.engine.brickController.getBrickByName(
        this.selectedBrick.name
      );
      brick.toggleVisibility();
    },

    setColour() {
      let brick = state.engine.brickController.getBrickByName(
        this.selectedBrick.name
      );
    },

    deleteBrick() {
      let brick = state.engine.brickController.removeBrickByName(
        this.selectedBrick.name
      );
      this.state.socket.emit("removeBrick", {
        studioId: this.state.studioId,
        brickName: this.selectedBrick.name,
      });

      this.toggleView('panel');
    },

    saveStudio() {
      fetch(`http://localhost:3000/api/studio/${state.studioId}/saveState`);
    },

    updateStudioDetails() {
      fetch(`http://localhost:3000/api/studio/${state.studioId}/saveSettings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.studioInfo),
      })
      .then(result => {
        state.engine.UISetSkyboxColour(state.studioInfo.skybox);
        state.engine.UISetGroundColour(state.studioInfo.ground);
      });

      // this.engine
    },

    exportFile() {
      fetch(`http://localhost:3000/api/studio/${state.studioId}/export`)
        .then((res) => res.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = `${state.studioId}.json`;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
        });
    },

    // changeLightDirection(){
    //   this.state.brickController.UIUpdateLight(this.light);
    // },

    // changeSkybox(){
    //   this.state.brickController.UIUpdateSkyBoxColour(this.skyboxHexCode);
    // },

    // changeGround() {
    //   this.state.brickController.UIUpdateGroundColour(this.groundHexCode);
    // },
  },
};
</script>

<style>
</style>