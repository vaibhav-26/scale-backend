const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PositionSchema = new Schema(
  {
    name: String,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Position = mongoose.model("Position", PositionSchema);

module.exports = Position;
