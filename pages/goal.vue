<script>
import myaxios from "~/lib/myaxios.js";
import loader from "~/components/loader.vue";
import requireLogin from "~/lib/reqLogin.js";
import subGoal from "~/components/subGoal.vue";

export default {
  async asyncData({ route }) {
    await requireLogin();
    let retv = await myaxios.get("/goal", { params: { id: route.query.id } });
    console.log(retv);
    return {
      goalName: retv["data"]["goal"],
      subGoals: retv["data"]["subgoals"],
      goalStatus: retv["data"]["status"],
    };
  },

  components: {
    subGoal,
    loader,
  },

  data() {
    return {
      showsubGoalDialog: false,
      newsubGoalTitle: "",
      errorMsg: "",
      showLoader: false,
    };
  },

  methods: {
    sendAddsubGoalReq: async function() {
      this.showLoader = true;
      let form = new FormData();
      form.set("title", this.newsubGoalTitle);
      form.set("id", this.$route.query.id);
      let retv = await this.$axios.$post("/goal", form);
      this.showLoader = false;
      if (retv["status"] != "error") {
        this.errorMsg = "";
        this.newsubGoalTitle = "";
        this.showsubGoalDialog = false;
        let goalData = await this.$axios.$get("/goal", {
          params: { id: this.$route.query.id },
        });
        this.subGoals = goalData["subgoals"];
        await this.toggleCompletion();
      } else {
        this.errorMsg = "Error: " + retv["message"];
      }
    },
    refreshsubGoals: async function() {
      this.showLoader = true;
      let response = await this.$axios.$get("/goal", {
        params: { id: this.$route.query.id },
      });
      this.showLoader = false;
      this.subGoals = response["subgoals"];
    },
    chkStatus: async function() {
      this.showLoader = true;
      for (let i = 0; i < this.subGoals.length; i++) {
        if (this.subGoals[i][3] == 0) {
          console.log("hey there");
          if (this.goalStatus == 1) {
            let form = new FormData();
            form.set("id", this.$route.query.id);
            form.set("status", 0);
            await this.$axios.patch("/goal", form);
            this.goalStatus = 0;
            this.showLoader = false;
            return;
          } else {
            this.showLoader = false;
            return;
          }
        }
      }
      console.log("what now?!");
      if (this.goalStatus == 0) {
        let form = new FormData();
        form.set("id", this.$route.query.id);
        form.set("status", 1);
        await this.$axios.$patch("/goal", form);
        this.goalStatus = 1;
        this.showLoader = false;
        return;
      } else {
        this.showLoader = false;
        return;
      }
    },
    toggleCompletion: async function() {
      await this.refreshsubGoals();
      this.showLoader = false;
      await this.chkStatus();
    },
  },
};
</script>

<template>
  <div class="container">
    <loader v-show="showLoader"></loader>
    <h1 class="page-header">{{ goalName }}</h1>
    <h2 v-if="goalStatus == 0" class="status-text">Status: Incomplete</h2>
    <h2 v-else-if="goalStatus == 1" class="status-text" style="color: #58da5c">
      Status: Complete
    </h2>
    <div>
      <p
        class="add-subGoal-button"
        @click="showsubGoalDialog = !showsubGoalDialog"
      >
        <span class="iconify add-course-icon" data-icon="mdi-plus-thick"></span>
        Add New subGoal
      </p>
      <div v-show="showsubGoalDialog" class="add-subGoal-dialog">
        <p class="dialog-header">Add New subGoal</p>
        <b-input
          v-model="newsubGoalTitle"
          type="text"
          placeholder="subGoal Title"
        ></b-input>
        <div
          style="font-size: large;color: red;width: fit-content;margin: 0px auto;"
        >
          {{ errorMsg }}
        </div>
        <div style="display: flex; justify-content: center;margin-top: 10px;">
          <p
            class="dialog-button"
            style="background-color: red"
            @click="
              errorMsg = '';
              showsubGoalDialog = false;
              newsubGoalTitle = '';
            "
          >
            Cancel
          </p>
          <p @click="sendAddsubGoalReq" class="dialog-button">Add</p>
        </div>
      </div>
    </div>
    <subGoal
      v-for="subGoal in subGoals"
      :key="subGoal[1]"
      :courseId="subGoal[0]"
      :id="subGoal[1]"
      :title="subGoal[2]"
      :status="subGoal[3]"
      @delete-req="showLoader = true"
      @deleted="
        showLoader = false;
        refreshsubGoals();
      "
      @update-req="showLoader = true"
      @st-update="toggleCompletion"
    ></subGoal>
  </div>
</template>

<style>
.container {
  padding: 0 30px;
}

.status-text {
  color: #da5858;
  font-family: monospace;
}

.add-course-icon {
  font-size: x-large;
  color: blue;
  margin-right: 0 5px;
  z-index: 1;
}

.add-subGoal-button {
  width: fit-content;
  margin: 15px auto;
  box-shadow: 1px 1px 5px blue;
  border-radius: 5px;
  padding: 10px;
  font-weight: bold;
}

.add-subGoal-button:hover {
  cursor: pointer;
  background-color: #f0eff5;
}

.add-subGoal-dialog {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 26%;
  height: 220px;
  width: 500px;
  background-color: #f0eff5;
  padding: 10px 30px;
  border-radius: 7px;
  box-shadow: 1px 1px 5px blue;
}

@media (max-width: 778px) {
  .add-subGoal-dialog {
    width: 90%;
    left: 4%;
    padding: 0 15px;
    box-sizing: border-box;
  }
}

.dialog-header {
  font-size: xx-large;
  width: fit-content;
  margin: 0 auto;
  margin-bottom: 10px;
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
</style>
