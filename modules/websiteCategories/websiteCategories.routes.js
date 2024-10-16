const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  getWebsiteCategories,
  getWebsiteCategory,
  editWebsiteCategory,
  deleteWebsiteCategory,
  addWebsiteCategory,
} = require("./websiteCategories.controllers");

const router = Router();

router.post("/", validateJWT, addWebsiteCategory);
router.get("/", validateJWT, getPagination, getWebsiteCategories);
router.get("/:uuid", validateJWT, getWebsiteCategory);
router.patch("/:uuid", validateJWT, editWebsiteCategory);
router.delete("/:uuid", validateJWT, deleteWebsiteCategory);

module.exports = router;
