const express = require("express");
const { createUser, connectUser } = require("../controllers/user.controller");
const { emailChecker } = require("../middlewares/emailChecker");
const { passwordCrypter } = require("../middlewares/passwordCrypter");
const router = express.Router();

router.post("/signup", emailChecker, passwordCrypter, createUser);
router.post("/login", connectUser);

module.exports = router;
