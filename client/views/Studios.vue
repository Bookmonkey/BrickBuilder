<template>
  <div class="studio">

    <div class="modal" v-if="showCreateUI">
      <div class="content">
        <h2>Create Studio</h2>

        <div>

          <div class="form-field">
            <label for="title">Studio title</label>
            <input type="text" v-model="newStudio.title">
          </div>

          <div class="form-field">
            <label for="public">Public <small>rooms are public by default</small></label>
            <input type="checkbox" v-model="newStudio.public" />
          </div>

          <h4>Additional settings</h4>

          <div class="form-field">
            <label for="password">Password (optional)</label>
            <input type="text" />
          </div>

          <div class="form-field">
            <label for="colour">Studio colour</label>
            <select id="colour" name="colour" v-model="newStudio.colour">
              <option value="black">Black</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
            </select>
          </div>

          <button class="button green" @click="createNewStudio()">Lets go</button>
        </div>
      </div>
    </div>

    
    <div class="landing pattern-cross-dots-lg bg-dark-blue">
      <div class="card">
        <div class="breadcrumb"><router-link to="/">Home</router-link> ></div>
        <div class="card-title">
          <h2>Studios</h2>
          <button class="button blue" @click="showCreateUI = true">New Studio</button>
        </div>


        <div class="form-field search">
          <label for="search">Search for studio</label>
          <input type="text" v-model="search"/>
        </div>
      

      </div>

      <div class="studio-list">

        <div class="studio" v-for="studio in filteredStudios" :key="studio.id" :class="studio.colour">
          <router-link class="link" :to="'/studio/' + studio.studio_id">
            <div class="title">{{ studio.title }}</div>
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
import { BrickColours } from "../utils/config";

export default {
  name: "Studios",
  data() {
    return {
      
      brickColours: BrickColours,
      brickColour: BrickColours[0],
      colourDropdown: false, 

      showCreateUI: false,
      newStudio: {
        title: "",
        public: true,
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
      fetch("http://localhost:3000/api/studio/create", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.newStudio),
      })
      .then(res => res.text())
      .then(studioId => {
        this.showCreateUI = false;
        
        this.studios.push({
          id: studioId,
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
  },
}
</script>

<style lang="scss">
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;

  &::before{
    content: '';
    position: absolute;

    opacity: 0.5;
    width: 100%;
    height: 100%;
    background: #003A54;
  }
  

  .content {
    width: 50%;
    min-height: 400px;
    background: white;
    margin: 0 auto;
    position: relative;
    padding: 18px;
  }

}

</style>