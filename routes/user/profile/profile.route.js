const { getMyProfile, deleteMyProfile, updateMyProfile, updateMyPassword } = require("../../../controllers/user/profile/profile.controller");
const isAuthenticated = require("../../../middleware/isAuthenticated");
const catchAsync = require("../../../services/catchAsync");


const router = require("express").Router()

router.route("/").get(isAuthenticated,catchAsync(getMyProfile)).delete(isAuthenticated,catchAsync(deleteMyProfile)).patch(isAuthenticated,catchAsync(updateMyProfile))

router.route("/changePassword").patch(isAuthenticated,catchAsync(updateMyPassword))


module.exports = router; 