const express = require("express");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");
const { getAllDatas } = require("../../controllers/admin/misc/datas");
const permitTo = require("../../middleware/permitTo");
const router = express.Router();

router.route("/misc/getAllDatas").get(isAuthenticated,permitTo("ADMIN"),catchAsync(getAllDatas))

module.exports = router