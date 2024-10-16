const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addAgencyUser,
  getAgencyUsers,
  deleteAgencyUser,
} = require("./agencyUsers.controllers");
const router = Router();

router.post("/", addAgencyUser);
router.get("/:uuid", validateJWT, getPagination, getAgencyUsers);
router.delete("/:uuid", validateJWT, deleteAgencyUser);

module.exports = router;
