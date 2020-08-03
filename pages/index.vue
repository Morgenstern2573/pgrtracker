<script>
import requireLogin from "~/lib/reqLogin.js";
import goal from "~/components/goal.vue";
import placeholder from "~/components/placeholder.vue";
import {
  getAllGoalData,
  createGoalBackEnd,
  deleteGoalBackEnd,
  modifyGoalBackEnd,
  modifySubGoalBackEnd,
  createSubGoalBackEnd,
  listGoals,
  listSubGoals,
  deleteSubGoalBackEnd,
} from "~/lib/api.js";

export default {
  async asyncData() {
    await requireLogin();

    let g = await getAllGoalData();

    if (g["has_goals"] == true) {
      if (g["has_subgoals"] == false) {
        return {
          hasGoals: true,
          goalList: g["goal_list"],
          subGoalList: [],
        };
      } else {
        return {
          hasGoals: true,
          goalList: g["goal_list"],
          subGoalList: g["subgoal_list"],
        };
      }
    } else {
      return { hasGoals: false, goalList: [], subGoalList: [] };
    }
  },

  components: {
    goal,
    placeholder,
  },

  data() {
    const today = new Date();
    return {
      newGoal: "",
      showDialog: false,
      errorMsg: "",
      isError: false,
      showLoader: false,
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      userDate: undefined,
    };
  },

  methods: {
    clearData() {
      this.userDate = undefined;
      this.showDialog = !this.showDialog;
      this.newGoal = "";
      this.isError = false;
      this.errorMsg = "";
    },

    async refreshGoalList() {
      this.showLoader = true;
      this.goalList = (await getAllGoalData())["goal_list"];
      this.showLoader = false;
    },

    getMonthName(i) {
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months[i];
    },

    async sendAddGoalRequest() {
      let title = this.newGoal;
      title = title.trim();
      if (title == "") {
        this.isError = true;
        this.errorMsg = "Goal title cannot be empty, nor space!";
        return;
      } else if (this.userDate == undefined) {
        this.isError = true;
        this.errorMsg = "You have to select a deadline!";
        return;
      } else {
        let form = new FormData();
        form.set("goal", this.newGoal);
        let deadline =
          String(this.userDate.getDate()) +
          "-" +
          this.getMonthName(this.userDate.getMonth()) +
          "-" +
          String(this.userDate.getFullYear());
        form.set("deadline", deadline);
        //Sending request and processing response
        this.showLoader = true;

        let retv = await createGoalBackEnd(form);
        this.showLoader = false;
        if (retv["status"] == "error") {
          this.isError = true;
          this.errorMsg = retv["message"];
        } else {
          //resetting dialog from data
          this.newGoal = "";
          this.userDate = undefined;
          this.showDialog = false;
          this.isError = false;
          this.errorMsg = "";
          let res = await getAllGoalData();
          this.goalList = res["goal_list"];
          this.subGoalList = res["subgoal_list"];
          this.hasGoals = true;
        }
      }
    },

    async sendEditGoalReq(id, title, deadline = "none") {
      let form = new FormData();
      form.set("id", id);
      form.set("type", "title");
      form.set("value", title);
      form.set("deadline", deadline);

      this.showLoader = true;
      let res = await modifyGoalBackEnd(form);
      this.showLoader = false;

      if (res["status"] == "error") {
        this.$buefy.toast.open({
          message: res["message"],
          type: "is-danger",
          duration: 2000,
        });
      } else {
        for (let i = 0; i < this.goalList.length; i++) {
          let el = this.goalList[i];
          if (el[2] == id) {
            this.$set(this.goalList[i], 1, title);
            if (deadline != "none") {
              this.$set(this.goalList[i], 4, deadline);
            }
            break;
          }
        }
      }
    },

    async toggleGoalStatus(id, status) {
      for (let i = 0; i < this.goalList.length; i++) {
        if (this.goalList[i][2] == id) {
          this.$set(this.goalList[i], 3, status);

          let form = new FormData();
          form.set("type", "status");
          form.set("id", id);
          form.set("status", status);
          await modifyGoalBackEnd(form);

          for (let i = 0; i < this.subGoalList.length; i++) {
            if (this.subGoalList[i][1] == id) {
              this.$set(this.subGoalList[i], 4, 1);
            }
          }
          break;
        }
      }
    },

    async updateGoalStatus(id) {
      let result = this.checkGoalStatus(id);
      for (let i = 0; i < this.goalList.length; i++) {
        let el = this.goalList[i];
        if (el[2] == id && el[3] != result) {
          this.$set(this.goalList[i], 3, result);

          let form = new FormData();
          form.set("id", id);
          form.set("type", "status");
          form.set("status", result);

          this.showLoader = true;
          await modifyGoalBackEnd(form);
          this.showLoader = false;
          break;
        }
      }
    },

    checkGoalStatus(id) {
      let subcourses = this.filterSubGoals(id);
      for (let i of subcourses) {
        if (i[4] == 0) {
          return 0;
        }
      }
      return 1;
    },

    async sendDeleteGoalReq(id) {
      this.showLoader = true;
      let res = await deleteGoalBackEnd(id);
      this.hasGoals = res["has_goals"];
      this.goalList = res["goal_list"];
      this.subGoalList = res["subgoal_list"];
      this.showLoader = false;
    },

    filterSubGoals(i) {
      return this.subGoalList.filter((el) => {
        return el[1] === i;
      });
    },

    async refreshSubGoalList() {
      this.subGoalList = await listSubGoals();
    },

    async sendAddsubGoalReq(title, id) {
      let form = new FormData();
      form.set("title", title);
      form.set("id", id);

      this.showLoader = true;
      let retv = await createSubGoalBackEnd(form);
      this.showLoader = false;

      if (retv["status"] == "error") {
        this.$buefy.toast.open({
          message: "Error: " + retv["message"],
          type: "is-danger",
          duration: 2000,
        });
      } else {
        this.subGoalList = retv["subgoal_list"];
        await this.updateGoalStatus(id);
      }
    },

    async sendDeleteSubGoalRequest(id, goalId) {
      this.showLoader = true;
      let response = await deleteSubGoalBackEnd(id);
      await this.refreshSubGoalList();
      await this.updateGoalStatus(goalId);
      this.showLoader = false;
    },

    async toggleSubGoalStatus(id, status, goalId) {
      let form = new FormData();
      form.set("id", id);
      form.set("status", status);

      await modifySubGoalBackEnd(form);

      this.showLoader = true;

      //mutating the subgoal data
      for (let i of this.subGoalList) {
        if (i[2] == id) {
          i[4] = status;
          break;
        }
      }

      await this.updateGoalStatus(goalId);
      this.showLoader = false;
    },
  },
};
</script>

<template>
  <div class="container">
    <b-loading
      :is-full-page="true"
      :active.sync="showLoader"
      :can-cancel="false"
    ></b-loading>
    <nav class="add-goal-cont">
      <div>
        <h1 class="page-header">My Goals</h1>
      </div>
      <div class="">
        <div class="add-goal-button" @click="showDialog = true">
          <span
            class="iconify add-goal-icon"
            data-icon="mdi-plus-thick"
            data-inline="false"
          ></span>
          <p>
            New Goal
          </p>
        </div>

        <div v-show="showDialog" class="dialog-cont">
          <div class="dialog">
            <h1 class="dialog-header">Add New Goal</h1>

            <p class="error" v-show="isError">{{ errorMsg }}</p>

            <b-input
              v-model="newGoal"
              class="dialog__input"
              type="text"
              placeholder="Goal Title"
            ></b-input>
            <b-datepicker
              v-model="userDate"
              class="dialog__input"
              icon="calendar-today"
              :min-date="minDate"
              placeholder="Select a deadline"
            ></b-datepicker>
            <div class="dialog__button-cont">
              <p
                @click="clearData"
                style="background-color: red;"
                class="dialog-button"
              >
                Cancel
              </p>
              <p @click="sendAddGoalRequest" class="dialog-button">Add</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="course-list-cont">
      <placeholder v-if="!hasGoals"><p>User has no courses</p></placeholder>
      <template v-else>
        <goal
          v-for="g in goalList"
          :key="g[2]"
          :id="g[2]"
          :title="g[1]"
          :status="g[3]"
          :deadline="g[4]"
          :subGoals="filterSubGoals(g[2])"
          @delete-goal="sendDeleteGoalReq"
          @goal-toggled="toggleGoalStatus"
          @delete-subgoal="sendDeleteSubGoalRequest"
          @sg-status-toggle="toggleSubGoalStatus"
          @add-subgoal="sendAddsubGoalReq"
          @goal-edited="sendEditGoalReq"
        >
        </goal>
      </template>
    </div>
  </div>
</template>

<style>
.dialog-cont {
  position: absolute;
  z-index: 10;
  height: 70vh;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}
.dialog {
  width: 500px;
  background-color: #f9f9fb;
  padding: 30px;
  border-radius: 7px;
  box-shadow: 1px 1px 5px rgba(154, 154, 162, 0.52157);
  height: fit-content;
}

@media (max-width: 426px) {
  .dialog {
    padding: 15px;
  }

  .dialog-header {
    text-align: center;
  }
}

.dialog-header {
  font-size: 1.7rem;
  width: fit-content;
  margin: 0 auto;
  margin-bottom: 20px;
  line-height: 1;
  font-weight: bold;
}

.dialog__button-cont {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.dialog-button {
  padding: 15px;
  color: white;
  background-color: blue;
  border-radius: 3px;
  margin: 0 15px;
  box-shadow: 1px 1px 5px #c4bdbd;
  width: 86px;
  line-height: 0;
  text-align: center;
}

.dialog-text {
  line-height: normal;
  text-align: center;
  margin: 5px auto;
}

.error {
  color: #a20909;
  margin: 0;
  margin-bottom: 19px;
  background: #edcece;
  padding: 5px 10px;
  text-align: center;
  border-radius: 4px;
  line-height: normal;
  font-size: 0.9rem;
}
</style>

<style scoped>
.container {
  padding: 0 30px;
}

.add-goal-cont {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header {
  font-size: 1.5rem;
  font-weight: bold;
}

.add-goal-icon {
  z-index: 1;
  font-size: x-large;
  color: blue;
  margin-right: 0 5px;
}

.add-goal-button {
  display: flex;
  align-items: center;
  box-shadow: 1px 1px 3px #8989d8;
  border-radius: 4px;
  padding: 10px;
  font-weight: bold;
}

.add-goal-button:hover {
  cursor: pointer;
  background-color: #f0eff5;
}

.dialog-button:hover {
  cursor: pointer;
}

.dialog__input {
  margin: 10px;
}
</style>
