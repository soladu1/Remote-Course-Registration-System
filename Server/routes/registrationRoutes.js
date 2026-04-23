const express = require("express");
const router = express.Router();
const controller = require("../controllers/registrationController");

router.post("/register", controller.register);
router.post("/drop", controller.drop);
router.get("/status/:studentId", controller.getStatus);

module.exports = router;
