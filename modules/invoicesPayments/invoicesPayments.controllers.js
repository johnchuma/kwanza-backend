const { Op } = require("sequelize");
const { InvoicePayment, User, Sequelize } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addRevivePublisherOrAffiliate,
} = require("../../utils/revive.controllers");
const findInvoicePaymentByUUID = async (uuid) => {
  try {
    const response = await InvoicePayment.findOne({
      where: {
        uuid,
      },
    });
    return response;
  } catch (error) {
    console.logpayment(error);
    throw error;
  }
};
const addInvoicePayment = async (invoicepayment, user) => {
  try {
    return await InvoicePayment.create({
      invoicepayment,
      userId: user.id,
    });
  } catch (error) {
    console.logpayment(error);
  }
};
const getInvoicePayments = async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await InvoicePayment.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      where: {
        invoicepayment: {
          [Op.like]: `%${keyword}%`,
        },
      },
      include: [User],
      attributes: {
        exclude: ["id"],
      },
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      rows: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
const getInvoicePaymentsStats = async () => {
  try {
    // Count invoicepayments and group them per day
    const response = await InvoicePayment.findAll({
      attributes: [
        [
          Sequelize.fn("DATE", Sequelize.col("createdAt")),
          "invoicepaymentgedAt",
        ], // Group by the date part of createdAt
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"], // Count invoicepayments
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))], // Group by date
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]], // Optional: Order by date
    });

    return response;
  } catch (error) {
    console.logpayment(error);
  }
};
const getInvoicePayment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const invoicepayment = await InvoicePayment.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, invoicepayment);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteInvoicePayment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const invoicepayment = await InvoicePayment.findOne({
      where: {
        uuid,
      },
    });
    const response = await invoicepayment.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editInvoicePayment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const invoicepayment = await InvoicePayment.findOne({
      where: {
        uuid,
      },
    });
    const response = await invoicepayment.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addInvoicePayment,
  deleteInvoicePayment,
  editInvoicePayment,
  getInvoicePaymentsStats,
  getInvoicePayment,
  getInvoicePayments,
  findInvoicePaymentByUUID,
};
