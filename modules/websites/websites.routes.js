const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addWebsite,
  getWebsites,
  getWebsite,
  editWebsite,
  deleteWebsite,
} = require("./websites.controllers");

const router = Router();

router.post("/", validateJWT, addWebsite);
router.get("/user/:uuid", validateJWT, getPagination, getWebsites);
router.get("/:uuid", validateJWT, getWebsite);
router.patch("/:uuid", validateJWT, editWebsite);
router.delete("/:uuid", validateJWT, deleteWebsite);

module.exports = router;
