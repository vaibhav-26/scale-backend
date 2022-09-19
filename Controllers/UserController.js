const db = require("../config/database");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Role = require("../Models/Role");
const Joi = require("joi");

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, username, password, email, phonenumber } =
      req.body;

    const result = createUserSchema.validate({
      firstname,
      lastname,
      username,
      password,
      email,
      phonenumber,
    });

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

    let user = await User.findOne({ username: username });

    const encryptedPassword = await bcrypt.hash(password, 10);

    const role = await Role.findOne({ name: "Hr" });

    if (user) {
      return res.status(422).json({
        errors: [
          {
            value: "",
            msg: "UserName already exists",
            param: "username",
            location: "body",
          },
        ],
      });
    } else {
      user = await User.create({
        firstname,
        lastname,
        username,
        password: encryptedPassword,
        email,
        phonenumber,
        role: role._id,
      });

      return res.status(200).json({
        user: user,
        token: jwt.sign({ user }, process.env.TOKEN_SECRET, {
          expiresIn: "5h",
        }),
        meta: {
          msg: "Registered Successfully.",
        },
      });
    }
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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = loginUserSchema.validate({
      username,
      password,
    });

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

    let user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        user,
        token: jwt.sign({ user }, process.env.TOKEN_SECRET, {
          expiresIn: "5h",
        }),
        meta: {
          msg: "Login Successfully.",
        },
      });
    } else {
      return res.status(422).json({
        errors: [
          {
            value: "",
            msg: "Invalid Credentials",
            param: "password",
            location: "body",
          },
        ],
      });
    }
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

const createUserSchema = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required().email(),
  phonenumber: Joi.string().required(),
});

const loginUserSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { createUser, login };
