"use strict";

import api from "./myaxios";

export async function getAllGoalData() {
  const url = "/";

  try {
    let retv = await api.get(url);
    return Object.assign({}, retv.data);
  } catch (err) {
    console.log("Something went wrong server-side", err);
  }
}

export async function listGoals() {
  const url = `/`;

  try {
    let retv = await api.get(url);
    return retv["data"]["goal_list"];
  } catch (err) {
    console.log("Something went wrong server-side", err);
  }
}

export async function listSubGoals() {
  const url = `/`;

  try {
    let retv = await api.get(url);
    return retv["data"]["subgoal_list"];
  } catch (err) {
    console.log("Something went wrong server-side", err);
  }
}

export async function createGoalBackEnd(form) {
  const url = "/";

  try {
    let retv = await api.post(url, form);
    return Object.assign({}, retv.data);
  } catch (err) {
    console.log("Something went wrong server-side at the goal endpoint", err);
  }
}

export async function deleteGoalBackEnd(id) {
  const url = "/";

  try {
    let retv = await api.delete(url, {
      params: { id: id },
    });
    return Object.assign({}, retv.data);
  } catch (err) {
    console.log("Something went wrong server-side at the goal endpoint", err);
  }
}

export async function modifyGoalBackEnd(form) {
  const url = "/";

  try {
    let retv = await api.patch(url, form);
    return Object.assign({}, retv.data);
  } catch (err) {
    console.log("Something went wrong server-side at the goal endpoint", err);
  }
}

export async function createSubGoalBackEnd(form) {
  const url = "/subgoals";

  try {
    let retv = await api.post("/subgoals", form);
    return Object.assign({}, retv.data);
  } catch (err) {
    console.log(
      "Something went wrong server-side at the subgoal endpoint",
      err
    );
  }
}

export async function modifySubGoalBackEnd(form) {
  const url = "/subgoals";

  try {
    let retv = await api.patch(url, form);
    return;
  } catch (err) {
    console.log(
      "Something went wrong server-side at the subgoal endpoint",
      err
    );
  }
}

export async function deleteSubGoalBackEnd(id) {
  const url = "/subgoals";

  try {
    let retv = await api.delete(url, {
      params: { id: id },
    });
    return;
  } catch (err) {
    console.log(
      "Something went wrong server-side at the subgoal endpoint",
      err
    );
  }
}
