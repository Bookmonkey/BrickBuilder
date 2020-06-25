<template>

  <div class="settings">
    <div class="group">
      <div class="button" @click="portModal()">
        <i data-feather="file-text"></i>    
        Show Block list
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
export default {
  name: "Settings",
  data(){
    return {
      settingsDropdown: false,
    }
  },
  mounted(){
    feather.replace();
  },
  methods: {
    toggleSettingsDropdown() {
      this.settingsDropdown = !this.settingsDropdown;
    },
    deleteStudioPrompt(){
      
    },
    portModal(){
      console.log("show import/export modal");
    }
  }
}
</script>

<style>

</style>