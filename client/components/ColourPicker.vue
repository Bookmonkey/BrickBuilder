<template>
  <div class="colour-picker">
    <div class="options">

    </div>

    <button class="button sm">Colours</button>

  </div>
</template>

<script>
export default {
  name: "ColourPicker",
  props: [
    "colour",
  ],
  data(){
    return {}
  }
}
</script>

<style>

.options {
  width: 300px;
  height: 300px;
}

</style>