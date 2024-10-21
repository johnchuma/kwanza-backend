const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getSettings, updateSettings } = require("./settings.controllers");
const router = Router();
router.get("/", validateJWT, getSettings);
router.patch("/", validateJWT, updateSettings);
module.exports = router;
