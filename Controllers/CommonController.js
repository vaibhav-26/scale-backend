const Role = require("../Models/Role");
const Position = require("../Models/Position");

const getAllRoles = async (req, res) => {
  const roles = await Role.find();
  res.status(200).json(roles);
};

const getAllPositions = async (req, res) => {
  const positions = await Position.find();
  res.status(200).json(positions);
};

module.exports = { getAllRoles, getAllPositions };
