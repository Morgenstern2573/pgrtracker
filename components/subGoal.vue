<script>
export default {
  props: ["id", "status", "goalId", "title"],
  data() {
    return {
      showLoader: false,
      showDeleteDialog: false,
      stInternal: this.status,
    };
  },

  computed: {
    stInternalBool: {
      get() {
        return Boolean(Number(this.status));
      },
      set() {
        return;
      },
    },
  },

  methods: {
    hideDeleteDialog() {
      this.showDeleteDialog = false;
    },

    handleToggle() {
      if (this.stInternalBool == false) {
        this.stInternal = 1;
      } else {
        this.stInternal = 0;
      }
      this.$emit("sg-status-toggle", this.id, this.stInternal, this.goalId);
    },
  },
};
</script>

<template>
  <div class="SubGoalBox">
    <b-loading
      :is-full-page="true"
      :active.sync="showLoader"
      :can-cancel="false"
    ></b-loading>
    <div class="subGoalBox__contentBox">
      <div class="subGoalBox__Row">
        <input
          type="checkbox"
          class="--checkbox --checkbox-small"
          v-model="stInternalBool"
          @input="handleToggle"
        />
        <p class="subGoalBox__title">{{ title }}</p>
      </div>
      <div class="subGoalBox__Row">
        <p v-if="stInternalBool" class="subGoalBox__text --green">
          Complete
        </p>
        <p v-else class="subGoalBox__text --red">Incomplete</p>
      </div>
    </div>
    <div class="subGoalBox__actionBox">
      <div
        @click="showDeleteDialog = true"
        class="icon-cont"
        title="delete button"
      >
        <span class="iconify icon" data-icon="mdi-trash-can"></span>
      </div>
      <div v-show="showDeleteDialog" class="dialog-cont">
        <div class="dialog">
          <p class="dialog-text">
            Are you sure you want to delete this sub goal?
          </p>
          <div class="dialog__button-cont">
            <p @click="hideDeleteDialog" class="btn dialog-button">
              Cancel
            </p>
            <p
              @click="
                $emit('delete-subgoal', id, goalId);
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
</template>

<style>
.--red__BG {
  background-color: #910707;
}
</style>

<style scoped>
.btn:hover {
  cursor: pointer;
}

.dialog-text {
  text-align: center;
  line-height: normal;
}

.SubGoalBox {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 15px auto;
  box-shadow: 1px 1px 5px #9292c7a6;
  padding: 15px;
  border-radius: 7px;
}

.subGoalBox__Row {
  display: flex;
  align-items: center;
}

.subGoalBox__contentBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.subGoalBox__title {
  text-transform: capitalize;
  font-size: 1.1rem;
}

.--checkbox-small {
  width: 15px;
  height: 15px;
}

.subGoalBox__text {
  font-family: monospace;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.subGoalBox__actionBox {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-left: 1px solid #efefef;
}

@media (max-width: 430px) {
  .subGoalBox {
    width: 100%;
    flex-direction: column;
  }

  .subGoalBox__actionBox {
    margin-top: 30px;
  }
}

.icon-cont {
  margin: 0 5px;
  height: 48px;
  width: 44px;
  display: flex;
  align-items: center;
}

.icon-cont:hover {
  cursor: pointer;
  background-color: #dcdcdc4d;
}

svg.iconify.icon {
  margin: 0 5px;
  height: 30px;
  width: 30px;
  color: #f793a2;
}

@media (max-width: 430px) {
  .subGoalBox__contentBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .subGoalBox__Row {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-items: center;
  }

  .subGoalBox__title {
    text-align: center;
  }

  .--checkbox-small {
    margin-bottom: 20px;
  }
}
</style>
