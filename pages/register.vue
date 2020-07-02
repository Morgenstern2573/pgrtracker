<template>
  <div class="container">
    <h1 class="page-header">Register</h1>
    <section class="form-control">
      <b-field label="Username">
        <b-input v-model="username" type="text"></b-input>
      </b-field>
      <b-field label="Password">
        <b-input v-model="password" type="password"></b-input>
      </b-field>
      <b-field label="Confirm">
        <b-input v-model="confirm" type="password"></b-input>
      </b-field>
    </section>
    <p v-on:click="sendForm" class="submit-button" tabindex="-1">Submit</p>
    <p class="error">{{ errorMsg }}</p>
    <p style="text-align: center">
      Already have an account? <nuxt-link to="/login">Log In</nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  layout: "auth",

  data() {
    return { username: "", password: "", confirm: "", errorMsg: "" };
  },

  methods: {
    async sendForm() {
      let form = new FormData();
      form.append("username", this.username);
      form.append("password", this.password);
      form.append("confirm", this.confirm);
      let res = await this.$axios.$post("/auth/register", form);
      if (res["status"] == "error") {
        this.errorMsg = "Error: " + res["message"];
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style>
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

.submit-button {
  background-color: blue;
  color: white;
  padding: 10px;
  border-radius: 7px;
  margin: 15px auto;
  width: 150px;
  text-align: center;
}

.submit-button:focus {
  background-color: black;
}

.submit-button:hover {
  cursor: pointer;
}

.error {
  width: fit-content;
  margin: 30px auto;
  font-size: 20px;
  color: red;
  font-family: monospace;
}
</style>
