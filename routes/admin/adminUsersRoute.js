const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const permitTo = require("../../middleware/permitTo");
const catchAsync = require("../../services/catchAsync");
const { getUsers, deleteUser } = require("../../controllers/admin/users/users.controller");
const router = express.Router();


router.route("/users").get(isAuthenticated,permitTo("ADMIN"),catchAsync(getUsers))
router.route("/users/:id").delete(isAuthenticated,permitTo("ADMIN"),catchAsync(deleteUser))


module.exports = router   