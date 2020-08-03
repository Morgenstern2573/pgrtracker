<script>
import validate from "~/lib/valField.js";
import subGoal from "~/components/subGoal.vue";
import placeholder from "~/components/placeholder.vue";

const today = new Date();

export default {
  props: ["id", "title", "status", "deadline", "subGoals"],
  components: {
    "sub-goal": subGoal,
    placeholder,
  },
  data() {
    return {
      showLoader: false,
      showDeleteDialog: false,
      editing: false,
      newTitle: this.title,
      isError: false,
      errorMsg: undefined,
      showSubGoalDialog: false,
      newsubGoalTitle: "",
      active: false,
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      newDate: undefined,
    };
  },

  computed: {
    stBool: {
      get: function() {
        return Boolean(Number(this.status));
      },

      set: function(newVal) {
        return;
      },
    },

    subGoalList() {
      return this.subGoals;
    },

    iTitle() {
      return this.title;
    },

    dueDate() {
      return this.deadline;
    },
  },

  methods: {
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

    emitAddSubGoalEvent() {
      let result = validate(this.newsubGoalTitle, undefined, "SubGoal Title");
      if (result["status"] == "pass") {
        this.$emit("add-subgoal", this.newsubGoalTitle, this.id);
        this.clearDialogData();
      } else {
        this.isError = true;
        this.errorMsg = "Error:" + result["message"];
      }
    },

    emitToggleReq() {
      let status;
      if (this.status == 0) {
        status = 1;
      } else {
        status = 0;
      }
      this.$emit("goal-toggled", this.id, status);
    },

    forwardSubGoalDeleteEmit(id, goalId) {
      this.$emit("delete-subgoal", id, goalId);
    },

    forwardSubGoalToggleEmit(id, status, goalId) {
      this.$emit("sg-status-toggle", id, status, goalId);
    },

    clearDialogData() {
      this.isError = false;
      this.errorMsg = "";
      this.newsubGoalTitle = "";
      this.showSubGoalDialog = false;
    },

    clearEditData() {
      this.editing = false;
      this.isError = false;
      this.errorMsg = "";
      this.newTitle = this.title;
      this.newDate = undefined;
    },

    valAndEmitEdit() {
      if (this.newTitle == this.title && this.newDate == undefined) {
        this.isError = true;
        this.errorMsg = "Error: No goal information changed";
        return;
      }

      let result = validate(this.newTitle, this.title, "new goal title");
      if (result["status"] == "fail") {
        this.isError = true;
        this.errorMsg = "Error: " + result["message"];
      } else {
        if (this.newDate != undefined) {
          let deadline =
            String(this.newDate.getDate()) +
            "-" +
            this.getMonthName(this.newDate.getMonth()) +
            "-" +
            String(this.newDate.getFullYear());

          this.$emit("goal-edited", this.id, this.newTitle, deadline);
        } else {
          this.$emit("goal-edited", this.id, this.newTitle);
        }

        this.clearEditData();
      }
    },
  },
};
</script>

<template>
  <div class="goalComponentBox">
    <b-loading
      :is-full-page="true"
      :active.sync="showLoader"
      :can-cancel="false"
    ></b-loading>
    <div class="goalBox">
      <div class="goalBox__content">
        <div>
          <div>
            <div class="goalBox__row">
              <div style="position: relative">
                <div class="disabler" v-show="subGoalList.length > 0"></div>
                <input
                  type="checkbox"
                  class="--checkbox"
                  title="toggle goal completion"
                  v-model="stBool"
                  @input="emitToggleReq"
                />
              </div>
              <p class="goalBox__title">
                {{ iTitle }}
              </p>
            </div>

            <div class="goalBox__row">
              <p v-if="stBool" class="goalBox__item --green">
                Complete
              </p>
              <p v-else class="goalBox__item --red">
                Incomplete
              </p>
              <p class="goalBox__item">Due: {{ dueDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="goalBox__action">
        <div
          class="icon-cont"
          :title="active ? 'hide subgoals' : 'show subgoals'"
          @click="active = !active"
        >
          <b-icon
            :icon="active ? 'chevron-up' : 'chevron-down'"
            class="icon"
            size="is-medium"
          ></b-icon>
        </div>

        <div class="icon-cont" title="edit goal name" @click="editing = true">
          <span class="iconify icon edit" data-icon="mdi-lead-pencil"></span>
        </div>
        <div class="dialog-cont" v-show="editing">
          <div class="dialog">
            <p class="dialog-header">Edit Goal Info</p>

            <p class="error" v-show="isError">{{ errorMsg }}</p>

            <b-field label="New Goal Title">
              <b-input type="text" v-model="newTitle"></b-input>
            </b-field>

            <b-field label="New Deadline">
              <b-datepicker
                v-model="newDate"
                icon="calendar-today"
                :placeholder="dueDate"
                :min-date="minDate"
              ></b-datepicker>
            </b-field>

            <div class="dialog__button-cont">
              <p class="btn dialog-button --red__BG" @click="clearEditData">
                Cancel
              </p>
              <p class="btn dialog-button" @click="valAndEmitEdit">Save</p>
            </div>
          </div>
        </div>

        <div
          @click="showDeleteDialog = true"
          class="icon-cont"
          title="delete goal"
        >
          <span class="iconify icon" data-icon="mdi-trash-can"></span>
        </div>
        <div class="dialog-cont" v-show="showDeleteDialog">
          <div class="dialog">
            <p class="dialog-text">
              Are you sure you want to delete this goal?
            </p>
            <div class="dialog__button-cont">
              <p @click="showDeleteDialog = false" class="btn dialog-button">
                Cancel
              </p>
              <p
                @click="
                  $emit('delete-goal', id);
                  showDeleteDialog = false;
                "
                class="btn dialog-button --red__BG"
              >
                Delete
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="subGoalBox" v-show="active">
      <div class="subGoalBox__Row --topRow">
        <p class="subGoalBox__title">SubGoals</p>
        <!-- add sub goal button and dialog -->
        <div>
          <p
            class="add-subGoal-button"
            @click="showSubGoalDialog = !showSubGoalDialog"
          >
            <span
              class="iconify add-goal-icon"
              data-icon="mdi-plus-thick"
            ></span>
            <span>New SubGoal</span>
          </p>
          <div v-show="showSubGoalDialog" class="dialog-cont">
            <div class="dialog">
              <p class="dialog-header">Add New SubGoal</p>

              <p class="error" v-show="isError">
                {{ errorMsg }}
              </p>

              <b-input
                v-model="newsubGoalTitle"
                type="text"
                placeholder="subGoal Title"
              ></b-input>
              <div class="dialog__button-cont">
                <p
                  class="btn dialog-button"
                  style="background-color: red"
                  @click="clearDialogData"
                >
                  Cancel
                </p>
                <p @click="emitAddSubGoalEvent" class="btn dialog-button">
                  Add
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="subGoalList.length > 0">
        <div class="subGoalBox__Row" v-for="s in subGoalList" :key="s[2]">
          <sub-goal
            :goalId="s[1]"
            :id="s[2]"
            :status="s[4]"
            :title="s[3]"
            @delete-subgoal="forwardSubGoalDeleteEmit"
            @sg-status-toggle="forwardSubGoalToggleEmit"
          ></sub-goal>
        </div>
      </template>
      <div v-else class="subGoalBox__Row">
        <placeholder><p>Goal has no Sub Goals</p></placeholder>
      </div>
    </div>
  </div>
</template>

<style>
.--red {
  color: #910707;
}

.--green {
  color: green;
}

.--checkbox {
  width: 23px;
  height: 23px;
  box-shadow: 0px 0px 3px #cbc7c7;
  margin-right: 5px;
  z-index: 1;
}
</style>

<style scoped>
.--red__BG {
  background-color: #910707 !important;
}

.btn:hover {
  cursor: pointer;
}

.disabler {
  z-index: 2;
  height: 24px;
  width: 24px;
  background-color: #efefefa3;
  position: absolute;
}

.icon {
  margin: 0 5px;
  height: 24px;
  width: 30px;
  display: flex;
  align-items: center;
}

.goalComponentBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.goalComponentBox .goalBox {
  margin: 15px auto;
  padding: 15px 30px;
  box-shadow: 1px 1px 5px rgba(145, 145, 169, 0.61961);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: -3px;
  position: relative;
}

.goalBox__content {
  flex-grow: 1;
}

.goalBox__action {
  border-left: 1px solid #efefef;
  padding: 10px;
  display: flex;
  margin-right: -20px;
  padding-left: 15px;
}

.goalBox__row {
  padding: 7px;
  display: flex;
  align-items: center;
}

.goalBox__title {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: left;
  text-transform: capitalize;
  color: blue;
  margin-left: 5px;
}

.goalBox__item {
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-right: 15px;
  font-size: 0.9rem;
}

.icon-cont {
  margin: 5px 5px;
  height: 38px;
  min-width: 28px;
  display: flex;
  align-items: center;
  margin-right: -5px;
}

.icon-cont:hover {
  cursor: pointer;
  background-color: #dcdcdc4d;
}

svg.iconify.icon {
  margin: 0 5px;
  height: 24px;
  width: 30px;
  color: #f46a7eb8;
}

svg.iconify.edit {
  color: blue;
}

.subGoalBox {
  width: 95%;
  box-shadow: 0px 3px 7px #d7d7e0;
  border-radius: 5px;
  padding: 15px 30px;
}

.subGoalBox__Row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.--topRow {
  line-height: 0;
  border-bottom: 1px solid #efefef;
  margin-bottom: 20px;
}

.subGoalBox__title {
  font-size: 1.2rem;
  font-weight: bold;
}

.add-goal-icon {
  font-size: x-large;
  color: blue;
  margin-right: 0 5px;
  z-index: 1;
}

.add-subGoal-button {
  width: fit-content;
  margin: 15px auto;
  box-shadow: 1px 1px 5px #9595b1c4;
  border-radius: 5px;
  padding: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.add-subGoal-button:hover {
  cursor: pointer;
  background-color: #f0eff5;
}

@media (max-width: 430px) {
  .--topRow {
    flex-direction: column;
    margin-top: 20px;
  }

  .goalComponentBox .goalBox {
    flex-direction: column;
  }

  .goalBox__row {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
