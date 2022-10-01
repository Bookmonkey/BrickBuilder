<template>
  <div class="home">
    <Navigation></Navigation>

    <div class="landing">
      <h1>Not a <span class="strikeout">Lego</span> Builder</h1>

      <div class="content">
        <p>Build and create your blocky creations online.</p>
        <p>By yourself or with others. </p>
        <p>Find, or create your own studio room</p>
      </div>

      <div class="cta">
        <router-link to="/studios" class="button blue lg">Find a Studio</router-link>
      </div>
      
      <img src="../assets/images/landing.png" alt="Landing Page with a couple of bricks" class="showcase" width="1000px">
    </div>

    <div class="features">
      <h3>Features</h3>
        <div class="features__list">
          <div class="features__item features__item--blue">
            <div class="title">Build together</div>
            <p>With up to 6 people</p>
          </div>

          <div class="features__item features__item--green">
            <div class="title">Public and Private studio</div>
            <p>Create with friends or and family</p>
          </div>

          <div class="features__item features__item--yellow">
            <div class="title">Open source</div>
            <p>This project is open source</p>
          </div>
        </div>
    </div>


    <div class="footer">
      <p>
        Made by: 
        <a href="https://danni.fyi" target="_blank">Danni Dickson</a>
      </p>
    </div>
  </div>

</template>

<script>
import Icon from "../components/Icon";
import Navigation from "../components/Navigation";
export default {
  name: "Home",
  components: {
    Icon,
    Navigation
  }
}
</script>

<style lang="scss">

</style>