<template>
    <div class="colour-picker">
      <div class="options" v-if="showColourOptions">
        <div class="form-field">
          <input type="text" placeholder="Search..." v-model="colourSearch" autofocus />
        </div>

        <div class="h5">Colours in use</div>

        <div class="button-list">
          <button
            class="button sm"
            v-for="colour in colours"
            @click="setColour(colour)"
            :key="colour.hex_code"
          >
            <span class="lego-colour" :style="{ background: colour.hex_code }"></span>
            {{ colour.name }}
          </button>
        </div>
      </div>

      <button class="button" @click="toggleOptions()">
        <span class="lego-colour" :style="{ background: state.user.colour.hex_code }"></span>
        {{ state.user.colour.name }}
      </button>
    </div>
</template>

<script>
import state from "../state";
import Engine from "../builder/Engine";

export default {
  name: "ColourPicker",

  data() {
    return {
      state: state,
      showColourOptions: false,
      filteredColours: null,
      colourSearch: null
    }
  },

  mounted() {
    this.filteredColours = this.state.colours;

    console.log(this.state.colours)
  },
  
    computed: {
      colours: function() {
        let colours = [];
        if(this.colourSearch) {
          colours = this.filteredColours;
        }
      
        colours = this.state.colours;

        return colours;
      }
    },

  methods: {
    // getColours() {
    //   if(this.colourSearch) {
    //     return this.filteredColours;
    //   }
    //   else return this.colours;
    // },
    toggleOptions() {
      this.showColourOptions = !this.showColourOptions;
    },
    setColour(colour) {
      Engine.setBrickColour(colour.hex_code);
      
      this.state.user.colour = colour;
      this.toggleOptions();
    }
  },
    watch: {
    colourSearch: function(val) {
      this.filteredColours = this.state.colours.filter(ele => {
        let name = ele.name.toLowerCase();
        val = val.toLowerCase();

        // add lego id and hex code later on
        if (name.indexOf(val) > -1) return ele;
      });
    }
  }
}
</script>

<style>

</style>