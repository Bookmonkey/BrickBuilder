<template>
  <div class="home">

    <!-- <div class="banner">
      <Icon :icon="'alert-circle'" :width="28" :height="28"></Icon>
      In active development
    </div> -->

    <Navigation></Navigation>

    <div class="landing">
      <h1>Not a Lego Builder</h1>

      <p class="p">Build and create Lego sets all online. By yourself or with others. </p>

      <div class="cta">
        <router-link to="/studios" class="button blue lg">Find a Studio</router-link>
      </div>

      
      <img src="../assets/images/landing.png" alt="Landing Page with a couple of bricks" class="showcase" width="1000px">
    </div>

    <div class="features">
      <h3>Features</h3>
        <div class="features-list">
          <div class="feature-item blue">
            <div class="title">Build together!</div>
          </div>

          <div class="feature-item green">
            <div class="title">Public and Private studio!</div>
            Create with friends or family!
          </div>

          <div class="feature-item yellow">
            <div class="title">Open source</div>
            This project is open source!
          </div>
        </div>

    </div>


    <div class="footer">

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