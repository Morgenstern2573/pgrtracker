<template> </template>

<script>
import myaxios from "~/lib/myaxios.js";

export default {
  async asyncData({ route }) {
    await myaxios.get("/auth/logout");
    window.location = "/login";
  },
};
</script>

<style></style>
