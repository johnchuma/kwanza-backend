const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  getDSPCampaignBanners,
  getDSPCampaignBanner,
  editDSPCampaignBanner,
  deleteDSPCampaignBanner,
  addDSPCampaignBanner,
} = require("./dspCampaignBanners.controllers");
const { upload, handleFileUpload } = require("../../utils/upload");

const router = Router();

router.post(
  "/",
  validateJWT,
  upload.single("file"),
  handleFileUpload,
  addDSPCampaignBanner
);
router.get(
  "/dsp-campaign/:uuid",
  validateJWT,
  getPagination,
  getDSPCampaignBanners
);
router.get("/:uuid", validateJWT, getDSPCampaignBanner);
router.patch("/:uuid", validateJWT, editDSPCampaignBanner);
router.delete("/:uuid", validateJWT, deleteDSPCampaignBanner);

module.exports = router;
