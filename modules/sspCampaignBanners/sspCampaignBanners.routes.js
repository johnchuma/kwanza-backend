const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");

const { upload, handleFileUpload } = require("../../utils/upload");
const {
  addSSPCampaignBanner,
  getSSPCampaignBanners,
  linkSSPCampaignBannerWithZone,
  unlinkSSPCampaignBannerWithZone,
  getSSPCampaignBanner,
  editSSPCampaignBanner,
  deleteSSPCampaignBanner,
} = require("./sspCampaignBanners.controllers");

const router = Router();

router.post(
  "/",
  validateJWT,
  upload.single("file"),
  handleFileUpload,
  addSSPCampaignBanner
);
router.get(
  "/ssp-campaign/:uuid",
  validateJWT,
  getPagination,
  getSSPCampaignBanners
);
router.post("/link-with-zone", validateJWT, linkSSPCampaignBannerWithZone);
router.post("/unlink-with-zone", validateJWT, unlinkSSPCampaignBannerWithZone);
router.get("/:uuid", validateJWT, getSSPCampaignBanner);
router.patch("/:uuid", validateJWT, editSSPCampaignBanner);
router.delete("/:uuid", validateJWT, deleteSSPCampaignBanner);

module.exports = router;
