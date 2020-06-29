import axios from "axios";

export default async function requireLogin() {
  const myaxios = axios.create({
    baseURL: "https://pgrtrack.herokuapp.com/",
    withCredentials: true,
  });

  let retv = await myaxios.get("/auth/user-status");

  if (retv["data"] != "User logged in") {
    window.location = "/login";
  }
}
