const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: String,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
  }
);

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
