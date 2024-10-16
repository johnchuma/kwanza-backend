const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addDSPCampaign,
  getDSPCampaigns,
  getDSPCampaign,
  editDSPCampaign,
  deleteDSPCampaign,
} = require("./dspCampaigns.controllers");

const router = Router();

router.post("/", validateJWT, addDSPCampaign);
router.get("/user/:uuid", validateJWT, getPagination, getDSPCampaigns);
router.get("/:uuid", validateJWT, getDSPCampaign);
router.patch("/:uuid", validateJWT, editDSPCampaign);
router.delete("/:uuid", validateJWT, deleteDSPCampaign);

module.exports = router;
