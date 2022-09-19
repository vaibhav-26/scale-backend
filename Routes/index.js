const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");
const uploadCv = require("../Middleware/uploadCv");
const UserController = require("../Controllers/UserController");
const CandidateController = require("../Controllers/CandidateController");
const CommonController = require("../Controllers/CommonController");
const Role = require("../Models/Role");
const Position = require("../Models/Position");

router.get("/roles", auth, CommonController.getAllRoles);

router.get("/positions", auth, CommonController.getAllPositions);

// Register
router.post("/register", UserController.createUser);

// Login
router.post("/login", UserController.login);

router.post(
  "/candidate/add",
  auth,
  uploadCv.single("cvUrl"),
  CandidateController.addCandidate
);

router.put(
  "/candidate/edit/:id",
  auth,
  uploadCv.single("cvUrl"),
  CandidateController.updateCandidate
);

router.delete(
  "/candidate/delete/:id",
  auth,
  CandidateController.removeCandidate
);

router.get("/candidates", CandidateController.getAllCandidate);

// For the seeding data

// router.post("/seeder", async () => {
//   try {
//     // Roles
//     const roleData = [
//       {
//         name: "Hr",
//       },
//     ];
//     await Role.deleteMany({});
//     await Role.insertMany(roleData);

//     // Positions
//     const positionData = [
//       {
//         name: "Web Backend",
//       },
//       {
//         name: "Web Frontend",
//       },
//       {
//         name: "DevOps",
//       },
//       {
//         name: "Android",
//       },
//       {
//         name: "IOS",
//       },
//     ];
//     await Position.deleteMany({});
//     await Position.insertMany(positionData);

//     return res.status(200).json({ message: "Data Import successfully" });
//   } catch (error) {
//     console.error("Error with data import", error);
//   }
// });

module.exports = router;
