<template> </template>

<script>
import axios from "axios";

const myaxios = axios.create({
  baseURL: "https://pgrtrack.herokuapp.com/",
  withCredentials: true,
});

export default {
  async asyncData({ route }) {
    await myaxios.get("/auth/logout");
    window.location = "/login";
  },
};
</script>

<style></style>
