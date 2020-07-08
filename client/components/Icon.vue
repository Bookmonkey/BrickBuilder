<template>
  <i :data-feather="icon" :width="width" :height="height"></i>
</template>

<script>
import feather from "feather-icons";
export default {
  name: "Icon",
  props: {
    icon: String, 
    width: {
      default: 18,
      type: Number
    },
    height: {
      default: 18,
      type: Number
    }
  },
  mounted(){
    feather.replace();
  }
}
</script>

<style>

</style>