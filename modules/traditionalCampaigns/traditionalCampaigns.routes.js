const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addTraditionalCampaign,
  getTraditionalCampaigns,
  getTraditionalCampaign,
  editTraditionalCampaign,
  deleteTraditionalCampaign,
} = require("./traditionalCampaigns.controllers");

const router = Router();

router.post("/", validateJWT, addTraditionalCampaign);
router.get("/user/:uuid", validateJWT, getPagination, getTraditionalCampaigns);
router.get("/:uuid", validateJWT, getTraditionalCampaign);
router.patch("/:uuid", validateJWT, editTraditionalCampaign);
router.delete("/:uuid", validateJWT, deleteTraditionalCampaign);

module.exports = router;
