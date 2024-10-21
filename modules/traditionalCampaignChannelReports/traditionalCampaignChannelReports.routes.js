const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addTraditionalCampaignChannelReport,
  getTraditionalCampaignChannelReports,
  deleteTraditionalCampaignChannelReport,
  editTraditionalCampaignChannelReport,
} = require("./traditionalCampaignChannelReports.controllers");

const router = Router();

router.post("/", validateJWT, addTraditionalCampaignChannelReport);
router.get(
  "/campaign/:uuid",
  validateJWT,
  getPagination,
  getTraditionalCampaignChannelReports
);
router.patch("/:uuid", validateJWT, editTraditionalCampaignChannelReport);
router.delete("/:uuid", validateJWT, deleteTraditionalCampaignChannelReport);

module.exports = router;
