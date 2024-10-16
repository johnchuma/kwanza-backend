const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addAudience,
  getAudiences,
  getAudience,
  editAudience,
  deleteAudience,
  getPretargetedAudiences,
} = require("./audiences.controllers");

const router = Router();

router.post("/", validateJWT, addAudience);
router.get("/user/:uuid", validateJWT, getPagination, getAudiences);
router.get("/pretargets", validateJWT, getPretargetedAudiences);
router.get("/:uuid", validateJWT, getAudience);
router.patch("/:uuid", validateJWT, editAudience);
router.delete("/:uuid", validateJWT, deleteAudience);

module.exports = router;
