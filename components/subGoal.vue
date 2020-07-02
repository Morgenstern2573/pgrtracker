<script>
export default {
  props: ["id", "status", "courseId", "title"],
  data() {
    return {
      showDeleteDialog: false,
      stInternal: this.status,
      stInternalBool: Boolean(Number(this.status)),
    };
  },
  methods: {
    sendDeleteRequest: async function() {
      this.$emit("delete-req");
      let response = await this.$axios.$delete("/goal", {
        params: { id: this.id },
      });
      this.$emit("deleted");
    },
    toggleCompletion: async function() {
      this.$emit("update-req");
      if (this.stInternal == "1") {
        this.stInternal = "0";
        this.stInternalBool = false;
      } else {
        this.stInternal = "1";
        this.stInternalBool = true;
      }

      let form = new FormData();
      form.set("id", this.id);
      form.set("status", this.stInternal);

      await this.$axios.$post("/scourse", form);
      this.$emit("st-update");
    },
    capitalize: function(str) {
      if (str != undefined) {
        return str.replace(/\w\S*/g, (w) =>
          w.replace(/^\w/, (c) => c.toUpperCase())
        );
      }
    },
    hideDeleteDialog() {
      this.showDeleteDialog = false;
    },
  },
};
</script>

<template>
  <div class="sub-cont">
    <div
      style="display: flex;
    align-items: center;"
    >
      <p class="sub-title">{{ capitalize(title) }}</p>
    </div>
    <div
      v-if="id != '-1'"
      style="display: flex;
            justify-content: space-evenly;"
    >
      <div
        @click="showDeleteDialog = true"
        class="icon-cont"
        title="delete button"
      >
        <span class="iconify icon" data-icon="mdi-trash-can"></span>
      </div>
      <div class="icon-cont" @click="toggleCompletion" title="mark as complete">
        <div v-show="stInternalBool">
          <span
            style="color: green;"
            class="iconify icon"
            data-icon="mdi-check-outline"
          ></span>
        </div>
      </div>
      <div class="delete-dialog" v-show="showDeleteDialog">
        <p class="delete-dialog-header">
          Are you sure you want to delete this sub course?
        </p>
        <div style="display: flex; justify-content: center">
          <p @click="hideDeleteDialog" class="dialog-button">
            Cancel
          </p>
          <p
            @click="sendDeleteRequest"
            style="background-color:red"
            class="dialog-button"
          >
            Delete
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.page-header {
  font-weight: bold;
  font-size: x-large;
  text-transform: capitalize;
}

.sub-cont {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 15px auto;
  box-shadow: 1px 1px 5px blue;
  padding: 15px;
  border-radius: 7px;
}

@media (max-width: 451px) {
  .sub-cont {
    width: 100%;
  }
}

.icon-cont {
  border: 2px solid;
  border-radius: 5px;
  margin: 0 5px;
  height: fit-content;
  height: 38px;
  width: 44px;
}

.icon-cont:hover {
  cursor: pointer;
  background-color: #dcdcdc4d;
}

svg.iconify.icon {
  margin: 0 5px;
  height: 30px;
  width: 30px;
  color: blue;
}

.delete-dialog {
  position: absolute;
  background-color: gainsboro;
  height: 120px;
  top: 33%;
  left: 26%;
  border-radius: 5px;
  box-shadow: 1px 1px 5px black;
  padding: 15px;
  z-index: 20;
}

@media (max-width: 768px) {
  .delete-dialog {
    top: 22%;
    left: 1.5%;
    width: 97%;
    height: 160px;
  }
}

.delete-dialog-header {
  font-weight: bold;
  font-size: large;
  margin: 0 auto;
  margin-bottom: 10px;
  width: fit-content;
}

.dialog-button {
  padding: 15px;
  color: white;
  background-color: blue;
  border-radius: 7px;
  margin: 0 15px;
  box-shadow: 1px 1px 3px black;
}
</style>
