const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addChannel,
  getChannels,
  getChannel,
  editChannel,
  deleteChannel,
} = require("./channels.controllers");

const router = Router();

router.post("/", validateJWT, addChannel);
router.get("/agency/:uuid", validateJWT, getPagination, getChannels);
router.get("/:uuid", validateJWT, getChannel);
router.patch("/:uuid", validateJWT, editChannel);
router.delete("/:uuid", validateJWT, deleteChannel);

module.exports = router;
