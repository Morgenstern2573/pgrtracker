<template>
  <div>
    <nav class="level top-nav">
      <div class="level-left">
        <nuxt-link to="/" class="level-item logo"> PgrTracker </nuxt-link>
      </div>
      <div class="level-right">
        <nuxt-link to="/" class="level-item nav-item">Settings</nuxt-link>
        <nuxt-link to="/logout" class="level-item nav-item">Log Out</nuxt-link>
      </div>
    </nav>
    <nuxt />
  </div>
</template>

<script></script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.top-nav {
  padding: 20px;
  box-shadow: 1px 1px 5px blue;
}

.logo {
  color: #000;
  font-size: 25px;
  font-weight: bold;
  margin: 0 15px;
}

.level-right .nav-item {
  color: blue;
  text-decoration: underline;
  margin: 0 15px;
  font-size: 17px;
}
</style>
