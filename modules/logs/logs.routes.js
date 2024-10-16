const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addLog,
  getLogs,
  getLog,
  editLog,
  deleteLog,
  getLogsStats,
} = require("./logs.controllers");

const router = Router();

router.post("/", validateJWT, addLog);
router.get("/", validateJWT, getPagination, getLogs);
router.get("/stats", validateJWT, getLogsStats);
router.get("/:uuid", validateJWT, getLog);
router.patch("/:uuid", validateJWT, editLog);
router.delete("/:uuid", validateJWT, deleteLog);

module.exports = router;
