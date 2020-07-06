<template>

  <div class="settings">
    <div class="group">
      <div class="button" @click="toggleBlockList()">
        <i data-feather="file-text"></i>
        <span v-if="!state.ui.blockList">Show block list</span>
        <span v-else>Hide block list</span>
      </div>
    </div>
    <div class="group">
      <!-- <div class="h5">Interface</div> -->
      <div class="button" @click="portModal()">
        <i data-feather="file-text"></i>    
        Import / export
      </div>
      
      <div class="button" @click="changeSkybox()">
        <i data-feather="file-text"></i>        
          Change Skybox
      </div>
    </div>

    <div class="group">
      <!-- <div class="h5">Dangerous</div> -->
      <div class="button" @click="changeSkybox()">
        <i data-feather="file-text"></i>        
          Change Studio settings
      </div>
      <div class="button red" @click="deleteStudioPrompt()">
        <i data-feather="trash"></i>        
          Delete studio    
      </div>
    </div>

  </div>
</template>

<script>
import feather from "feather-icons";
import state from "../state";
export default {
  name: "Settings",
  data(){
    return { 
      state: state
    }
  },
  mounted(){
    feather.replace();
  },
  methods: {
    toggleBlockList() {
      this.state.ui.blockList = !this.state.ui.blockList;
    },
    deleteStudioPrompt(){
      
    },
    portModal(){
      // console.log("show import/export modal");
    }
  }
}
</script>

<style>

</style>