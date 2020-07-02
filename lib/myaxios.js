import axios from "axios";

export default axios.create({
  baseURL: "https://pgrtrack.herokuapp.com/",
  withCredentials: true,
});
