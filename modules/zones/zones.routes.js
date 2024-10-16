const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addZone,
  getZones,
  getZone,
  editZone,
  deleteZone,
  getBannerZones,
  getZoneBanners,
} = require("./zones.controllers");

const router = Router();

router.post("/", validateJWT, addZone);
router.get("/website/:uuid", validateJWT, getPagination, getZones);
router.get("/banner/:uuid", validateJWT, getPagination, getBannerZones);
router.get("/banners/:uuid", validateJWT, getPagination, getZoneBanners);
router.get("/:uuid", validateJWT, getZone);
router.patch("/:uuid", validateJWT, editZone);
router.delete("/:uuid", validateJWT, deleteZone);

module.exports = router;
