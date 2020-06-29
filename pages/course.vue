<template>
  <div class="container">
    <h1 class="page-header">{{ courseName }}</h1>
    <div>
      <p
        class="add-subcourse-button"
        @click="showSubcourseDialog = !showSubcourseDialog"
      >
        <span class="iconify add-course-icon" data-icon="mdi-plus-thick"></span>
        Add New SubCourse
      </p>
      <div v-show="showSubcourseDialog" class="add-subcourse-dialog">
        <p class="dialog-header">Add New Subcourse</p>
        <b-input
          v-model="newSubcourseTitle"
          type="text"
          placeholder="SubCourse Title"
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
              showSubcourseDialog = false;
              newSubcourseTitle = null;
            "
          >
            Cancel
          </p>
          <p @click="sendAddSubcourseReq" class="dialog-button">Add</p>
        </div>
      </div>
    </div>
    <subCourse
      v-for="subCourse in subCourses"
      :key="subCourse[1]"
      :courseId="subCourse[0]"
      :id="subCourse[1]"
      :title="subCourse[2]"
      :status="subCourse[3]"
      v-on:sc-deleted="refreshSubcourses"
    ></subCourse>
  </div>
</template>

<script>
import axios from "axios";
import requireLogin from "~/lib/auth.js";
import subCourse from "~/components/subCourse.vue";

const myaxios = axios.create({
  baseURL: "https://pgrtrack.herokuapp.com/",
  withCredentials: true,
});

export default {
  async asyncData({ route }) {
    await requireLogin();
    let retv = await myaxios.get("/course", { params: { id: route.query.id } });
    return {
      courseName: retv["data"]["course"],
      subCourses: retv["data"]["subcourses"],
    };
  },

  components: {
    subCourse,
  },

  data() {
    return {
      showSubcourseDialog: false,
      newSubcourseTitle: "",
      errorMsg: null,
    };
  },

  methods: {
    sendAddSubcourseReq: async function() {
      let form = new FormData();
      form.set("title", this.newSubcourseTitle);
      form.set("id", this.$route.query.id);
      let retv = await this.$axios.$post("/course", form);
      if (retv["status"] != "error") {
        this.newSubcourseTitle = "";
        this.showSubcourseDialog = false;
        let courseData = await this.$axios.$get("/course", {
          params: { id: this.$route.query.id },
        });
        this.subCourses = courseData["subcourses"];
      } else {
        this.errorMsg = "Error: " + retv["message"];
      }
    },
    refreshSubcourses: async function() {
      let response = await this.$axios.$get("/course", {
        params: { id: this.$route.query.id },
      });
      this.subCourses = response["subcourses"];
    },
  },
};
</script>

<style>
.container {
  padding: 0 30px;
}

.add-course-icon {
  font-size: x-large;
  color: blue;
  margin-right: 0 5px;
  z-index: 1;
}

.add-subcourse-button {
  width: fit-content;
  margin: 15px auto;
  box-shadow: 1px 1px 5px blue;
  border-radius: 5px;
  padding: 10px;
  font-weight: bold;
}

.add-subcourse-button:hover {
  cursor: pointer;
  background-color: #f0eff5;
}

.add-subcourse-dialog {
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
  .add-subcourse-dialog {
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
