import myaxios from "~/lib/myaxios.js";
const APICODE_LOGINOK = "User logged in";

export default async function requireLogin() {
  let retv = await myaxios.get("/auth/user-status");

  if (retv["data"] !== APICODE_LOGINOK) {
    window.location = "/login";
  }
}
