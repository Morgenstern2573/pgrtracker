<script>
import axios from "axios";
import requireLogin from "~/lib/auth.js";

const myaxios = axios.create({
  baseURL: "https://pgrtrack.herokuapp.com/",
  withCredentials: true,
});

export default {
  async asyncData() {
    await requireLogin();

    let retv = await myaxios.get("/");

    return { courseList: retv["data"] };
  },
  data() {
    return {
      newCourse: "",
      newCourseCode: "",
      showDialog: false,
      errorMsg: "",
    };
  },

  methods: {
    sendAddRequest: async function() {
      let title = this.newCourse;
      let code = this.newCourseCode;
      title = title.trim();
      code = code.trim();

      if (title == "" || code == "") {
        this.errorMsg = "Course title/code cannot be empty, nor space!";
      } else {
        let form = new FormData();
        form.set("course", this.newCourse);
        form.set("code", this.newCourseCode);
        let retv = await this.$axios.$post("/", form);
        console.log(retv);
        if (retv["status"] == "error") {
          this.errorMsg = retv["message"];
        } else {
          this.newCourse = "";
          this.newCourseCode = "";
          this.showDialog = false;
          this.errorMsg = "";
          this.courseList = await this.$axios.$get("/");
        }
      }
    },
    capitalize: function(str) {
      if (str != undefined) {
        return str.replace(/\w\S*/g, (w) =>
          w.replace(/^\w/, (c) => c.toUpperCase())
        );
      }
    },
    clearData: function() {
      this.showDialog = !this.showDialog;
      this.newCourse = "";
      this.errorMsg = "";
      this.newCourseCode = "";
    },
  },
};
</script>

<template>
  <div class="container">
    <nav class="level add-course-cont">
      <div class="level-item">
        <div class="add-course-button">
          <span
            class="iconify add-course-icon"
            data-icon="mdi-plus-thick"
            data-inline="false"
          ></span>
          <p @click="showDialog = true">
            Add New Course
          </p>
        </div>
        <div class="add-course-dialog" v-show="showDialog">
          <h1 class="dialog-header">Add New Course</h1>
          <b-input
            v-model="newCourse"
            type="text"
            placeholder="Course Title"
          ></b-input>
          <b-input
            v-model="newCourseCode"
            type="text"
            placeholder="Course Code"
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
      <div v-for="course in courseList" :key="course[3]" class="course-cont">
        <nuxt-link
          :to="{ path: 'course', query: { id: course[3] } }"
          class="course-title"
        >
          {{ capitalize(course[1]) }}
        </nuxt-link>
        <h3>
          {{ course[2].toUpperCase() }}
        </h3>
      </div>
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
  height: 300px;
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

.course-cont {
  margin: 15px auto;
  padding: 30px;
  box-shadow: 1px 1px 5px blue;
  border-radius: 7px;
}

a.course-title {
  font-size: x-large;
  font-weight: bold;
  color: blue;
  text-decoration: underline;
  text-align: left;
}

.error {
  color: red;
  width: fit-content;
  margin: 0 auto;
}
</style>
