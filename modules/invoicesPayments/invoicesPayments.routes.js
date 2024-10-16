const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addInvoicePayment,
  getInvoicePayments,
  getInvoicePayment,
  editInvoicePayment,
  deleteInvoicePayment,
  getInvoicePaymentsStats,
} = require("./invoicepayments.controllers");

const router = Router();

router.post("/", validateJWT, addInvoicePayment);
router.get("/", validateJWT, getPagination, getInvoicePayments);
router.get("/stats", validateJWT, getInvoicePaymentsStats);
router.get("/:uuid", validateJWT, getInvoicePayment);
router.patch("/:uuid", validateJWT, editInvoicePayment);
router.delete("/:uuid", validateJWT, deleteInvoicePayment);

module.exports = router;
