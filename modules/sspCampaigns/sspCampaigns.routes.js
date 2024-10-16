const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addSSPCampaign,
  getSSPCampaigns,
  getSSPCampaign,
  editSSPCampaign,
  deleteSSPCampaign,
} = require("./sspCampaigns.controllers");

const router = Router();

router.post("/", validateJWT, addSSPCampaign);
router.get("/user/:uuid", validateJWT, getPagination, getSSPCampaigns);
router.get("/:uuid", validateJWT, getSSPCampaign);
router.patch("/:uuid", validateJWT, editSSPCampaign);
router.delete("/:uuid", validateJWT, deleteSSPCampaign);

module.exports = router;
