import axios from "axios";

export default async function requireLogin() {
  const myaxios = axios.create({
    baseURL: "http://127.0.0.1:5000/",
    withCredentials: true,
  });

  let retv = await myaxios.get("/auth/user-status");
  console.log(retv);

  if (retv["data"] != "User logged in") {
    window.location = "/login";
  }
}
