<template>
  <div class="home">

    <div class="banner">
      <Icon :icon="'alert-circle'" :width="28" :height="28"></Icon>
      In active development
    </div>
    <div class="landing">

      <div class="card">
        <h2>Not a Lego Builder</h2>

        <p class="p">Build and create Lego sets all online. By yourself or with others. </p>

        <div class="cta">
          <router-link to="/studios" class="button blue">Studios</router-link>
        </div>
      </div>
    </div>

    <div class="features">
      <h3>Features</h3>

      <div class="features-list">
        <div class="feature-item blue">
          <!-- <Icon :icon="'users'"></Icon> -->
          <div class="title">Build together!</div>
        </div>

        <div class="feature-item green">
          <!-- <Icon :icon="'users'"></Icon> -->
          <div class="title">Public and Private studio!</div>
          Create with friends or family!
        </div>

        <div class="feature-item yellow">
          
          <!-- <Icon :icon="'book-open'"></Icon> -->
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
export default {
  name: "Home",
  components: {
    Icon
  }
}
</script>

<style lang="scss">
.landing {
  height: 240px;
  padding: 48px;
}

.cta {
  display: flex;
  justify-self: space-around;
  width: 180px;
  text-align: center;
}

</style>