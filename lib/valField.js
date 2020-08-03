"use strict";

export default function validate(changed, original, field) {
  if (changed == "") {
    return {
      status: "fail",
      message: field + " can't be empty",
    };
  } else if (changed.trim() == "") {
    return {
      status: "fail",
      message: field + " can't be a space or sequence of spaces",
    };
  } else {
    return { status: "pass" };
  }
}
