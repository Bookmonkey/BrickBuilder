<template>
  <div class="modal" :class="size">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: ["size"],
}
</script>

<style>

</style>