<template>
  <div class="home">
    <div class="landing pattern-cross-dots-lg bg-dark-blue">

      <div class="card">
        <h2>Brick builder</h2>

        <p class="p">Build and create Lego sets all online. By yourself or with others. </p>

        <router-link to="/studios" class="button blue">Create a Studio</router-link>
      </div>
    </div>

    <div class="features">
      <h3>Features</h3>
      
      Build together.
      Create either a private or public studio to create your lego set.

      Opensource

    </div>
  </div>

</template>

<script>
export default {
  name: "Home"
}
</script>

<style lang="scss">

.pattern-cross-dots-lg.bg-dark-blue {
  color: #006D9F;
}

.landing {
  height: 400px;
  padding: 48px;
}

</style>