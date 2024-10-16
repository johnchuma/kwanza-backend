const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  addUser,
  getUsers,
  getMyInfo,
  getUserInfo,
  updateUser,
  deleteUser,
  sendCode,
  resetPassword,
  confirmCode,
  getAdvertisers,
  getPublishers,
  getInfluencers,
} = require("./users.controllers");
const { getPagination } = require("../../utils/getPagination");
const {
  getAccounts,
  addReviveAdvertiser,
} = require("../../utils/revive.controllers");
const router = Router();

router.post("/", addUser);
router.post("/auth/confirm-code", confirmCode);
router.post("/auth/send-code", sendCode);
router.post("/auth/reset-password/:email", resetPassword);
router.get("/", validateJWT, getPagination, getUsers);
router.get("/me", validateJWT, getMyInfo);
router.get(
  "/advertisers/agency/:uuid",
  validateJWT,
  getPagination,
  getAdvertisers
);
router.get("/publishers", validateJWT, getPagination, getPublishers);
router.get("/influencers", validateJWT, getPagination, getInfluencers);
router.get("/:uuid", validateJWT, getUserInfo);
router.patch("/:uuid", validateJWT, updateUser);
router.delete("/:uuid", validateJWT, deleteUser);

module.exports = router;
