<template>
  <div class="nav">
    <div class="content">
      <div class="title">
        <router-link to="/">Not a lego builder</router-link>
      </div>

      <div class="links">
        <!-- <router-link class="item" to="/about">About</router-link>
        <router-link class="item" to="/creations">Creations</router-link> -->
        <router-link class="item" to="/studios">Studios</router-link>
        <!-- <router-link class="item" to="/signup">Sign-up</router-link>
        <router-link class="item" to="/login">Login</router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navigation"
};
</script>

<style>
</style>