<script>
import validate from "~/lib/valField.js";
export default {
  layout: "auth",

  data() {
    return {
      username: "",
      password: "",
      confirm: "",
      errorMsg: "",
      isLoading: false,
    };
  },

  methods: {
    async sendForm() {
      let form = new FormData();
      form.append("username", this.username);
      form.append("password", this.password);
      form.append("confirm", this.confirm);
      //validating input values
      let resA = validate(this.username, undefined, "username");
      let resB = validate(this.password, undefined, "password");
      let resC = validate(this.confirm, undefined, "confirm password");
      if (resA["status"] == "fail") {
        this.errorMsg = "Error: " + resA["message"];
        return;
      } else if (resB["status"] == "fail") {
        this.errorMsg = "Error: " + resB["message"];
        return;
      } else if (resC["status"] == "fail") {
        this.errorMsg = "Error: " + resC["message"];
        return;
      }
      this.isLoading = true;
      let res = await this.$axios.$post("/auth/register", form);
      this.isLoading = false;
      if (res["status"] == "error") {
        this.errorMsg = "Error: " + res["message"];
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <h1 class="page-header">Register</h1>
    <p class="error">{{ errorMsg }}</p>
    <section class="form-control" @keydown.enter="sendForm">
      <b-field label="Username">
        <b-input v-model="username" type="text" class="--form-field"></b-input>
      </b-field>
      <b-field label="Password">
        <b-input
          v-model="password"
          type="password"
          class="--form-field"
        ></b-input>
      </b-field>
      <b-field label="Confirm">
        <b-input
          v-model="confirm"
          type="password"
          class="--form-field"
        ></b-input>
      </b-field>
      <b-button
        @click="sendForm"
        :loading="isLoading"
        class="submit-button"
        tabindex="-1"
        >Submit</b-button
      >
    </section>

    <p style="text-align: center">
      Already have an account? <nuxt-link to="/login">Log In</nuxt-link>
    </p>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.field {
  margin: 30px auto;
  max-width: 300px;
}

.page-header {
  font-size: 40px;
  opacity: 0.9;
  margin: 15px auto;
  color: blue;
  width: fit-content;
}

section.form-control {
  display: flex;
  flex-direction: column;
}

.--form-field {
  width: 250px;
}

.submit-button {
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 7px;
  margin: 15px auto;
  width: 150px;
  text-align: center;
}

.submit-button:hover {
  cursor: pointer;
}

.error {
  width: fit-content;
  margin: 0px auto;
  font-size: 20px;
  color: red;
  font-family: monospace;
}
</style>
