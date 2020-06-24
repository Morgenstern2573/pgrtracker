<template>
  <div class="container">
    {{ courseList }}
  </div>
</template>

<script>
import axios from "axios";
import requireLogin from "~/lib/auth.js";

const myaxios = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

export default {
  async asyncData() {
    await requireLogin();

    let retv = await myaxios.get("/");

    return { courseList: retv["data"] };
  },
  data() {
    return {};
  },
};
</script>

<style></style>
