const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  adminDashboardStats,
  dspCampaignStats,
  sspCampaignStats,
} = require("./stats.controllers");

const router = Router();

router.get("/admin", validateJWT, adminDashboardStats);
router.get("/dsp-campaign/:uuid", validateJWT, dspCampaignStats);
router.get("/ssp-campaign/:uuid", validateJWT, sspCampaignStats);

module.exports = router;
