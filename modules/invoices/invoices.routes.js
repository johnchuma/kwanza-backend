const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addInvoice,
  getInvoices,
  getInvoice,
  editInvoice,
  deleteInvoice,
  getInvoicesStats,
  getUserInvoices,
  addInvoicePayment,
  deleteInvoicePayment,
} = require("./invoices.controllers");

const router = Router();

router.post("/", validateJWT, addInvoice);
router.post("/:uuid/payment", validateJWT, addInvoicePayment);
router.get("/user/:uuid", validateJWT, getPagination, getUserInvoices);
router.get("/", validateJWT, getPagination, getInvoices);
router.get("/stats", validateJWT, getInvoicesStats);
router.get("/:uuid", validateJWT, getInvoice);
router.patch("/:uuid", validateJWT, editInvoice);
router.delete("/:uuid", validateJWT, deleteInvoice);
router.delete("/:uuid/payment", validateJWT, deleteInvoicePayment);

module.exports = router;
