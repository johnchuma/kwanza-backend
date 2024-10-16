const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addAgency,
  getAgencies,
  editAgency,
  deleteAgency,
  getEgency,
} = require("./agencies.controllers");
const router = Router();

router.post("/", addAgency);
router.get("/", validateJWT, getPagination, getAgencies);
router.get("/:uuid", validateJWT, getEgency);
router.patch("/:uuid", validateJWT, editAgency);
router.delete("/:uuid", validateJWT, deleteAgency);

module.exports = router;
