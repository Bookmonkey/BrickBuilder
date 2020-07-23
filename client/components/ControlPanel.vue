<template>
  <div class="control-panel">    
    <div class="panel-button button sm icon-left" v-show="!showPanel" @click="showControlPanel()">
      <Icon :icon="'menu'"></Icon>
      Control Panel
    </div>

    <div class="panel" v-show="showPanel">
      <div v-show="uiState === 'panel'">
        <div class="heading">
          <div class="dropdown" @click="dropdown = !dropdown">
            <div class="button sm icon-left">
              <Icon :icon="'menu'"></Icon>
              Menu
            </div>
            <div class="items" v-if="dropdown">
              <div class="item icon-left" @click="hideControlPanel()">
                <Icon :icon="'x-square'"></Icon>
                Hide control panel
              </div>
              <div class="item icon-left" @click="saveStudio()">
                <Icon :icon="'save'"></Icon>
                Save Studio
              </div>
              <div class="item icon-left" @click="toggleView('port')">
                <Icon :icon="'file'"></Icon>
                Import / Export
              </div>
              <div class="item icon-left" @click="toggleView('settings')">
                <Icon :icon="'settings'"></Icon>
                Settings
              </div>
            </div>
          </div>
          <div class="h5">Control Panel</div>
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
              v-for="(brick, index) in brickList"
              :key="index"
              :class="{brick, selected: isSelectedBrick(brick.name)}"
            >
              <div class="title">
                {{ brick.name }}
              </div>

              <button class="button sm icon-right"  @click="toggleView('brick', brick.name)">
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

        <div class="content">
          <div class="h5">Studio</div>
          
          <div class="form-field">
            <label for="studioName">Studio name</label>
            <input class="full-size" type="studioName" name="studioName" id="studioName" v-model="state.studioInfo.title" />
          </div>

          <div class="form-field">
            <label for="visibility">Visibility</label>
            <select c name="visibility" id="visibility">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div class="form-field">
            <label for="colour">Studio colour</label>
            <select id="colour" name="colour" v-model="state.studioInfo.colour">
              <option value="black">Black</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
              <option value="purple">Purple</option>
              <option value="blue">Blue</option>
            </select>
          </div>

          <div class="form-field">
            <label for="password">Password</label>
            <input class="full-size" type="password" name="password" id="password" />
          </div>
          
          <div class="h5">Interface</div>
          <label for="dol">Direction of Light</label>
          <div class="form-field inline">
            <input type="text" v-model="state.studioInfo.direction_light[0]">
            <input type="text" v-model="state.studioInfo.direction_light[1]">
            <input type="text" v-model="state.studioInfo.direction_light[2]">
          </div>

          <div class="form-field">
            <label for="skybox">Skybox colour</label>
            <input type="text" id="skybox" name="skybox" class="full-size" v-model="state.studioInfo.skybox" />
          </div>

          <div class="form-field">
            <label for="ground">Ground colour</label>
            <input type="text" id="ground" name="ground" class="full-size" v-model="state.studioInfo.ground" />
          </div>

          <div class="form-field">
            <div class="button green icon-left" @click="updateStudioDetails()">
              <Icon :icon="'save'"></Icon>
              Save & update
            </div>
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

            <div class="form-field">
              <button class="button sm" @click="toggleVisibility()">
                Visibility
              </button>
              <button class="button red sm" @click="deleteBrick()">
                Delete Brick
              </button>
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
            <input type="file" name="import" id="import" class="full-size">
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

      uiState: 'panel',

      selectedBrick: [],

      showPanel: false,      
      showModal: false,

      dropdown: false,
      state: state
    };
  },
  computed: {
    brickList: function() {
      if(this.state.engine === null) return [];
      else return this.state.engine.getBricksList();
    }
  },
  methods: {
    
    isSelectedBrick(brickName) {
      let selectedBrick = this.state.selectedBrick;
      if(selectedBrick !== null && selectedBrick.name === brickName) return true;
      else return false;
    },

    hideControlPanel() {
      this.showPanel = false;
    },
    showControlPanel() {
      this.showPanel = true;
      this.uiState = 'panel';
    },

    toggleView(view, brickName) {
      this.uiState = view;

      if(brickName) {
        let brick = state.engine.brickController.getBrickByName(brickName);

        this.selectedBrick = brick;
      }
    },


    toggleVisibility(){
      let brick = state.engine.brickController.getBrickByName(this.selectedBrick.name);
      brick.toggleVisibility();
    },

    setColour(){
      let brick = state.engine.brickController.getBrickByName(this.selectedBrick.name);
    },

    deleteBrick(){
      let brick = state.engine.brickController.getBrickByName(this.selectedBrick.name);
    },

    saveStudio() {
      fetch(`http://localhost:3000/api/studio/${state.studioId}/saveState`)
    },

    updateStudioDetails(){
      fetch(`http://localhost:3000/api/studio/${state.studioId}/saveSettings`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.studioInfo),
      })

      // this.engine
    },

    exportFile() {
      fetch(`http://localhost:3000/api/studio/${state.studioId}/export`)
      .then(res =>  res.blob())
      .then(blob => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = `${state.studioId}.json`;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();    
          a.remove();  //afterwards we remove the element again         
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
  }
};
</script>

<style>
</style>