<template>
  <div class="home">
    <div class="landing">

      <div class="card">
        <h2>Brick builder</h2>

        <p class="p">Build and create Lego sets all online. By yourself or with others. </p>

        <router-link to="/studios" class="button blue">Create a Studio</router-link>
      </div>
    </div>

    <div class="features">
      <h3>Features</h3>

      <div class="features-list">
        <div class="feature-item blue">
          <img class="feature-image" src="../images/users.svg" alt="Build together with your friends">
          <div class="title">Build together!</div>
        </div>

        <div class="feature-item green">
          <img  class="feature-image" src="../images/lock.svg" alt="Locked padlock">
          <div class="title">Public and Private studio!</div>
          Create with friends or family!
        </div>

        <div class="feature-item yellow">
          
          <img class="feature-image" src="../images/book-open.svg" alt="Open book">
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
export default {
  name: "Home"
}
</script>

<style lang="scss">
.landing {
  height: 240px;
  padding: 48px;
}

</style>