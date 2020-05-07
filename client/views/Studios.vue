<template>
  <div class="studio">

    <div class="modal" v-if="showCreateUI">
      <div class="content">
        <h3>Create Studio</h3>

        <div>
          <label for="title">Studio title</label>
          <input type="text" v-model="newStudio.title">

          <label for="public">Public <small>rooms are public by default</small></label>
          <input type="checkbox" v-model="newStudio.public" />

          <button class="button green" @click="createNewStudio()">Lets go</button>
        </div>
      </div>
    </div>

    
    <div class="landing pattern-cross-dots-lg bg-dark-blue">
      <div class="card">
        <div><router-link to="/">Home</router-link> ></div>
        <h2>Studios</h2>

      

        <button class="button blue" @click="showCreateUI = true">New Studio</button>
      </div>

      <div class="studio-list">

        <div class="studio" v-for="studio in studios" :key="studio.id">
          <router-link class="link" :to="'/studio/' + studio.id">
            <div class="title">{{ studio.title }}</div>
          </router-link>

          created by: name
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Studios",
  data() {
    return {
      showCreateUI: false,
      newStudio: {
        title: "",
        public: true,

      },
      studios: [],
    }
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
      .then(res => {
        // handle redirect to studio
        this.showCreateUI = false;
        console.log(res);
        
        this.studios.push({
          ...this.newStudio
        })
      })
      .catch(error => console.error(error));
    }
  },
  mounted(){
   fetch("http://localhost:3000/api/studios/true")
   .then(res => res.json())
   .then(studios => {
     this.studios = studios;          
   });
  }
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
    height: 400px;
    background: white;
    margin: 0 auto;
    position: relative;
  }

}

</style>