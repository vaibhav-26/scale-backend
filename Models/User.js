const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    phonenumber: String,
    password: String,
    role: { type: Schema.Types.ObjectId, ref: "Role" },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
