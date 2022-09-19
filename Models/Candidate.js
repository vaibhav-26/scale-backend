const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CandidateSchema = new Schema(
  {
    fullname: String,
    dob: Date,
    relevantPosition: { type: Schema.Types.ObjectId, ref: "Position" },
    technology: [String],
    yearsOfExperience: String,
    currentCity: String,
    currentCtc: Number,
    expectedCtc: Number,
    cvUrl: { type: String },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
  }
);

CandidateSchema.virtual("Position", {
  ref: "Position",
  foreignField: "_id",
  localField: "relevantPosition",
});

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
