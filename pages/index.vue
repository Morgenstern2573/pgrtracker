<script>
import myaxios from "~/lib/myaxios.js";
import requireLogin from "~/lib/reqLogin.js";
import loader from "~/components/loader.vue";
import goal from "~/components/goal.vue";

export default {
  async asyncData() {
    await requireLogin();

    let retv = await myaxios.get("/");

    return { goalList: retv["data"] };
  },

  components: {
    loader,
    goal,
  },

  data() {
    return {
      newGoal: "",
      showDialog: false,
      errorMsg: "",
      showLoader: "",
    };
  },

  methods: {
    sendAddRequest: async function() {
      this.showLoader = true;
      let title = this.newGoal;
      title = title.trim();

      if (title == "") {
        this.errorMsg = "Goal titlecannot be empty, nor space!";
      } else {
        let form = new FormData();
        form.set("goal", this.newGoal);
        let retv = await this.$axios.$post("/", form);
        console.log(retv);
        if (retv["status"] == "error") {
          this.errorMsg = retv["message"];
        } else {
          this.showLoader = false;
          this.newGoal = "";
          this.showDialog = false;
          this.errorMsg = "";
          this.goalList = await this.$axios.$get("/");
        }
      }
    },
    clearData: function() {
      this.showDialog = !this.showDialog;
      this.newGoal = "";
      this.errorMsg = "";
    },
    async refreshGoalList() {
      this.showLoader = true;
      this.goalList = await this.$axios.$get("/");
      this.showLoader = false;
    },
  },
};
</script>

<template>
  <div class="container">
    <loader v-show="showLoader"></loader>
    <nav class="level add-course-cont">
      <div class="level-item">
        <div class="add-course-button" @click="showDialog = true">
          <span
            class="iconify add-course-icon"
            data-icon="mdi-plus-thick"
            data-inline="false"
          ></span>
          <p>
            Add New Goal
          </p>
        </div>
        <div class="add-course-dialog" v-show="showDialog">
          <h1 class="dialog-header">Add New Goal</h1>
          <b-input
            v-model="newGoal"
            type="text"
            placeholder="Goal Title"
          ></b-input>
          <p class="error">{{ errorMsg }}</p>
          <div style="display: flex; justify-content: center;margin-top: 30px;">
            <p
              @click="clearData"
              style="background-color: red;"
              class="dialog-button"
            >
              Cancel
            </p>
            <p @click="sendAddRequest" class="dialog-button">Add</p>
          </div>
        </div>
      </div>
    </nav>
    <div class="course-list-cont">
      <goal
        v-for="g in goalList"
        :key="g[2]"
        :id="g[2]"
        :title="g[1]"
        :status="g[3]"
        @req-sent="showLoader = true"
        @res-arrived="
          showLoader = false;
          refreshGoalList();
        "
      >
      </goal>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0 30px;
}

.add-course-icon {
  z-index: 1;
  font-size: x-large;
  color: blue;
  margin-right: 0 5px;
}

.add-course-button {
  display: flex;
  border: 1px solid;
  box-shadow: 1px 1px 3px blue;
  border-radius: 7px;
  padding: 10px;
  font-weight: bold;
}

.add-course-button:hover {
  cursor: pointer;
  background-color: #f0eff5;
}

@media (max-width: 778px) {
  .add-course-dialog {
    width: 90% !important;
    padding: 0 15px !important;
    box-sizing: border-box;
  }
}

.add-course-dialog {
  z-index: 10;
  position: absolute;
  top: 0;
  height: 220px;
  width: 500px;
  background-color: #f0eff5;
  padding: 10px 30px;
  border-radius: 7px;
  box-shadow: 1px 1px 5px blue;
}

.dialog-header {
  font-size: xx-large;
  width: fit-content;
  margin: 0 auto;
  margin-bottom: 30px;
  font-weight: bold;
}

.dialog-button {
  padding: 15px;
  color: white;
  background-color: blue;
  border-radius: 7px;
  margin: 0 15px;
  box-shadow: 1px 1px 3px black;
}

.dialog-button:hover {
  cursor: pointer;
}

input.input {
  margin: 5px;
}

.error {
  color: red;
  width: fit-content;
  margin: 0 auto;
}
</style>
