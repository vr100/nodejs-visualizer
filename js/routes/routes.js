const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController.js");

router.get("/", appController.home);
router.post("/showPlay", appController.showPlay);

module.exports = router;