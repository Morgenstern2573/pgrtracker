import axios from "axios";

export default axios.create({
  baseURL: "https://pgrtrack.herokuapp.com",
  // baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});
