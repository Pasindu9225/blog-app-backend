const express = require("express");
const authController = require("../controller/authController");
const auth = require('../middlewares/auth');

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "test page working" }));

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/logout',auth, authController.logout);
router.get('/refresh', authController.refresh);

module.exports = router;
