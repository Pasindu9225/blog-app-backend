const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "test page working" }));

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
