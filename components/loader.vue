<template>
  <div class="outer">
    <div class="core"></div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.outer {
  height: 120vh;
  position: absolute;
  background-color: rgba(220, 220, 220, 0.45882);
  width: 122%;
  left: -13%;
  right: 0;
  z-index: 30;
  top: -106%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.core {
  height: 100px;
  width: 100px;
  border: 10px solid white;
  border-bottom: 10px solid blue;
  border-radius: 50%;
  animation-name: spin;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(45deg);
  }
  to {
    transform: rotate(405deg);
  }
}
</style>
