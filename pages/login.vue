<script>
import validate from "~/lib/valField.js";
export default {
  layout: "auth",

  data() {
    return { username: "", password: "", errorMsg: "", isLoading: false };
  },

  methods: {
    async sendForm() {
      console.log("hey!");
      this.isLoading = true;
      //validating input values
      let resA = validate(this.username, undefined, "username");
      let resB = validate(this.password, undefined, "password");
      if (resA["status"] == "fail") {
        this.errorMsg = "Error: " + resA["message"];
        return;
      } else if (resB["status"] == "fail") {
        this.errorMsg = "Error: " + resB["message"];
        return;
      }

      let form = new FormData();
      form.append("username", this.username);
      form.append("password", this.password);
      let res = await this.$axios.$post("/auth/login", form);
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
    <section>
      <h1 class="page-header">Log In</h1>

      <p class="error">{{ errorMsg }}</p>

      <form class="form-control" @keydown.enter="sendForm">
        <b-field label="Username">
          <b-input
            v-model="username"
            type="text"
            class="--form-field"
            required="true"
          ></b-input>
        </b-field>
        <b-field label="Password">
          <b-input
            v-model="password"
            type="password"
            class="--form-field"
            required="true"
          ></b-input>
        </b-field>
        <b-button
          @click="sendForm"
          :loading="isLoading"
          class="submit-button"
          type="submit"
          tabindex="-1"
        >
          Submit
        </b-button>
      </form>
    </section>

    <p style="text-align: center">
      Don't have an account yet? <nuxt-link to="/register">Register</nuxt-link>
    </p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
}

.field {
  margin: 15px auto;
  max-width: 300px;
}

.page-header {
  font-size: 40px;
  opacity: 0.9;
  margin: 15px auto;
  color: blue;
  width: fit-content;
}

.form-control {
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
