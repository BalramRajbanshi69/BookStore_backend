const express = require("express")
const { regiterUser, loginUser } = require("../../controllers/auth/user.controller")
const router = express.Router()


router.route("/register").post(regiterUser)
router.route("/login").post(loginUser)

module.exports = router