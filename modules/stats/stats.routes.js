const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  adminDashboardStats,
  dspCampaignStats,
  sspCampaignStats,
  publisherDashboardStats,
  publisherRevenueDashboardStats,
  advertiserDashboardStats,
  agencyDashboardStats,
  agencyAdvertisersStats,
} = require("./stats.controllers");

const router = Router();

router.get("/admin", validateJWT, adminDashboardStats);
router.get("/publisher/:uuid", validateJWT, publisherDashboardStats);
router.get("/advertiser/:uuid", validateJWT, advertiserDashboardStats);
router.get("/agency/:uuid", validateJWT, agencyDashboardStats);
router.get("/agency/:uuid/advertisers", validateJWT, agencyAdvertisersStats);
router.get(
  "/publisher/:uuid/revenue",
  validateJWT,
  publisherRevenueDashboardStats
);
router.get("/dsp-campaign/:uuid", validateJWT, dspCampaignStats);
router.get("/ssp-campaign/:uuid", validateJWT, sspCampaignStats);

module.exports = router;
