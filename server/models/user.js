//describes how each user will be structured in our db. Users are modeled as an object with 5 props: username,
// email, pw and id
// this model will be called upon later when we create our register route because each user will need to utilize it.

import mongoose from "mongoose"; //mongoDB only provides us id
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
