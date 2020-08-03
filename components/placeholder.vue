<template>
  <div class="placeholder-box">
    <slot class="placeholder-box__Title"></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.placeholder-box {
  width: 80%;
  max-width: 890px;
  border-radius: 5px;
  padding: 15px;
  margin: 15px auto;
}
</style>
