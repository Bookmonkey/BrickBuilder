<template>
  
  <div class="studio">
    <Navigation></Navigation>
    <div class="modal" v-if="showCreateUI">
      <div class="content">
        <h2>Create Studio</h2>
        <div>
          <div class="form-field">
            <label for="title">Studio title</label>
            <input type="text" class="full-size" v-model="newStudio.title" name="title" id="title">
          </div>

          <div class="form-field">
            <label for="visibility">Visibility</label>
            <select class="select full-size" name="visibility" id="visibility" v-model="newStudio.public">
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
          </div>

          <!-- <h4>Additional settings</h4>
          
            <div class="form-field">
              <label for="password_protect">Password protect studio? <input type="checkbox" v-model="newStudio.password_protected" id="password_protect" name="password_protect" /></label>
            </div>
          <div class="form-group" v-if="newStudio.password_protected">
            <div class="form-field inline">
              <label for="password">Password (optional)</label>
              <input type="text" class="full-size" name="password" id="password" v-model="newStudio.password" />
            </div>
            <div class="form-field inline">
              <label for="password_confirm">Password confirm (optional)</label>
              <input type="text" class="full-size" name="password_confirm" id="password_confirm" v-model="newStudio.password_confirm" />
            </div>
          </div> -->
          

          <div class="form-field">
            <label for="colour">Studio colour</label>
            <select class="select full-size" id="colour" name="colour" v-model="newStudio.colour">
              <option value="black">Black</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
            </select>
          </div>

          <button class="button green" @click="createNewStudio()">Create studio</button>
        </div>
      </div>
    </div>

    
    <div class="page-content bg-dark-blue">
      <div class="card">
        <div class="breadcrumb"><router-link to="/">Home</router-link> ></div>
        <div class="card-title">
          <h2>Studios</h2>
          <button class="button blue" @click="showCreateUI = true">New Studio</button>
        </div>


        <div class="form-field search">
          <label for="search">Search for studio</label>
          <input type="text" class="full-size" v-model="search"/>
        </div>
      

      </div>

      <div class="studio-list">

        <div class="studio" v-for="studio in filteredStudios" :key="studio.studio_id" :class="studio.colour">
          <router-link class="link" :to="'/studio/' + studio.studio_id">
            <div class="title">
              {{ studio.title }}
              <Icon :icon="'lock'" v-if="studio.password_protected"></Icon>
            </div>
            <div>
              created by: name
            </div>

            <div>
              Builders: {{ studio.builders }}
            </div>
          </router-link>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { log } from 'three';
import Navigation from "../components/Navigation";
import Icon from '../components/Icon.vue';
export default {
  name: "Studios",
  components: {
    Navigation,
    Icon
  },
  data() {
    return {
      colourDropdown: false, 
      showCreateUI: false,
      newStudio: {
        title: "",
        public: true,
        password_protected: false,
        password: null,
        password_confirm: null,
        colour: "black"
      },
      search: '',
      filteredStudios: [],
      studios: [],
    }
  },
  watch: {
    'search': function(val) {
      this.filteredStudios = this.studios.filter(ele => {
        if(ele.title.toLowerCase().indexOf(val.toLowerCase()) > -1) return ele;
      }); 
    }
  },
  mounted(){    
   fetch("http://localhost:3000/api/studios/true")
   .then(res => res.json())
   .then(studios => {
     this.filteredStudios = studios;
     this.studios = studios;   
   });
  },
  methods: {
    createNewStudio(){
      let valid = this.validateForm();

      console.log(valid);



      fetch("http://localhost:3000/api/studio/create", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.newStudio),
      })
      .then(res => res.text())
      .then(studioId => {
        console.log(studioId);
        this.showCreateUI = false;
        
        this.studios.push({
          studio_id: studioId,
          ...this.newStudio
        })

        this.newStudio = {
          id: '',
          title: '',
          public: true,
        }
      })
      .catch(error => console.error(error));
    },

    validateForm(){
      let valid = true;
      if(this.isEmpty(this.newStudio.title)) {
        valid = false;
      }

      if(this.newStudio.password_protected) {
        if(this.isEmpty(this.newStudio.password) && this.isEmpty(this.newStudio.password_confirm)) {
          valid = false;
        }

        if(this.newStudio.password !== this.newStudio.password_confirm) {
          valid = false;
        }
      }
      return valid;
    },

    isEmpty(value){
      if(value === undefined || value === null || value.length === 0) return true;
    }
  },
}
</script>