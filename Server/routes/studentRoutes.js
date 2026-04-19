const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentController");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.get("/", controller.getAllStudents);
router.get("/:id", controller.getStudent);
router.put("/:id", controller.updateStudent);

module.exports = router;
