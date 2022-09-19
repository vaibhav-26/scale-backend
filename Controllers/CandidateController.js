const db = require("../config/database");
const User = require("../Models/User");
const Candidate = require("../Models/Candidate");
const Joi = require("joi");

const addCandidate = async (req, res) => {
  try {
    const reqData = req.body;
    reqData.cvUrl = req?.file?.path;
    reqData.technology = reqData.technology.split(",");
    const result = addCandidateSchema.validate(reqData);
    if (result.error) {
      return res.status(422).json({
        errors: [
          {
            value: result.error.details[0].context.value,
            msg: result.error.message,
            param: result.error.details[0].context.key,
            location: "body",
          },
        ],
      });
    }
    const technology = reqData?.technology?.length;
    if (technology > 10) {
      return res.status(422).json({
        errors: [
          {
            value: reqData?.technology,
            msg: "Please Enter Maximum 10 Keyword",
            param: "technology",
            location: "body",
          },
        ],
      });
    }

    let candidate = await Candidate.create({
      fullname: reqData.fullname,
      dob: reqData.dob,
      relevantPosition: reqData.relevantPosition,
      technology: reqData.technology,
      yearsOfExperience: reqData.yearsOfExperience,
      currentCity: reqData.currentCity,
      currentCtc: reqData.currentCtc,
      expectedCtc: reqData.expectedCtc,
      cvUrl: req?.file?.path,
    });

    candidate = await candidate.populate("Position");

    return res.status(200).json({
      candidate,
      meta: {
        msg: "Candidate Added Successfully.",
      },
    });
  } catch (e) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
        },
      ],
    });
  }
};

const getAllCandidate = async (req, res) => {
  try {
    const { candidate, position, experience, page } = req.query;

    const candidates = await Candidate.aggregate([
      { $unwind: { path: "$Position", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "positions",
          localField: "relevantPosition",
          foreignField: "_id",
          as: "Position",
        },
      },
      {
        $match: {
          $and: [
            { fullname: { $regex: candidate, $options: "i" } },
            { "Position.name": { $regex: position, $options: "i" } },
            experience ? { yearsOfExperience: experience } : {},
          ],
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
          data: [{ $skip: (page - 1) * 10 }, { $limit: 10 }],
        },
      },
    ]);

    return res.status(200).json(candidates);
  } catch (e) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
        },
      ],
    });
  }
};

const removeCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findOne({ _id: id }).remove();

    return res.status(200).json({
      candidate,
      meta: {
        msg: "Candidate Removed Successfully.",
      },
    });
  } catch (e) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
        },
      ],
    });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullname,
      dob,
      relevantPosition,
      technology,
      yearsOfExperience,
      currentCity,
      currentCtc,
      expectedCtc,
    } = req.body;

    const obj = {
      fullname,
      dob,
      relevantPosition,
      technology: technology.split(","),
      yearsOfExperience,
      currentCity,
      currentCtc,
      expectedCtc,
    };

    const result = updateCandidateSchema.validate(obj);
    if (result.error) {
      return res.status(422).json({
        errors: [
          {
            value: result.error.details[0].context.value,
            msg: result.error.message,
            param: result.error.details[0].context.key,
            location: "body",
          },
        ],
      });
    }
    if (req?.file?.path) obj["cvUrl"] = req.file.path;
    if (obj.technology.length > 10) {
      return res.status(422).json({
        errors: [
          {
            value: technology,
            msg: "Please Enter Maximum 10 Keyword",
            param: "technology",
            location: "body",
          },
        ],
      });
    }
    const candidate = await Candidate.findOneAndUpdate({ _id: id }, obj, {
      new: true,
    }).populate("Position");

    return res.status(200).json({
      candidate,
      meta: {
        msg: "Candidate Updated Successfully.",
      },
    });
  } catch (e) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
        },
      ],
    });
  }
};

const addCandidateSchema = Joi.object().keys({
  fullname: Joi.string().required(),
  dob: Joi.date().required(),
  relevantPosition: Joi.string().required(),
  technology: Joi.array().required(),
  yearsOfExperience: Joi.number().required(),
  currentCity: Joi.string().required(),
  currentCtc: Joi.number().required(),
  expectedCtc: Joi.number().required(),
  cvUrl: Joi.string().required(),
});

const updateCandidateSchema = Joi.object().keys({
  fullname: Joi.string().required(),
  dob: Joi.string().required(),
  relevantPosition: Joi.string().required(),
  technology: Joi.array().required(),
  yearsOfExperience: Joi.number().required(),
  currentCity: Joi.string().required(),
  currentCtc: Joi.number().required(),
  expectedCtc: Joi.number().required(),
});

module.exports = {
  addCandidate,
  updateCandidate,
  getAllCandidate,
  removeCandidate,
};
