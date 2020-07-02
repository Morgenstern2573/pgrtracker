<template>
  <div class="course-cont">
    <div>
      <p v-if="id == -1" class="course-title">{{ title }}</p>
      <nuxt-link
        v-else
        :to="{ path: 'goal', query: { id: id } }"
        class="course-title"
      >
        {{ title }}
      </nuxt-link>
      <p v-if="status == 1" class="status-text" style="color: #58da5c">
        Status: Complete
      </p>
      <p v-else-if="status == 0" class="status-text">Status: Incomplete</p>
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
      <div class="delete-dialog" v-show="showDeleteDialog">
        <p class="delete-dialog-header">
          Are you sure you want to delete this goal?
        </p>
        <div style="display: flex; justify-content: center">
          <p @click="showDeleteDialog = false" class="dialog-button">
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

<script>
export default {
  props: ["id", "title", "status"],
  data() {
    return { showDeleteDialog: false };
  },
  methods: {
    async sendDeleteRequest() {
      this.$emit("req-sent");
      let retv = await this.$axios.$delete("/", { params: { id: this.id } });
      this.showDeleteDialog = false;
      this.$emit("res-arrived");
    },
  },
};
</script>

<style>
.course-cont {
  margin: 15px auto;
  padding: 30px;
  box-shadow: 1px 1px 5px blue;
  border-radius: 7px;
  display: flex;
  justify-content: space-between;
}

.course-title {
  font-size: x-large;
  font-weight: bold;
  color: blue;
  text-decoration: underline;
  text-align: left;
  text-transform: capitalize;
}

p.course-title {
  text-decoration: none;
}

.icon-cont {
  border: 2px solid;
  border-radius: 5px;
  margin: 0 5px;
  height: fit-content;
  height: 38px;
  min-width: 28px;
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

p.status-text {
  color: #da5858;
  font-family: monospace;
}
</style>
