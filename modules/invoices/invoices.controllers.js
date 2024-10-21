const { Op } = require("sequelize");
const { Invoice, User, Sequelize, InvoicePayment } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");

const findInvoiceByUUID = async (uuid) => {
  try {
    const response = await Invoice.findOne({
      where: {
        uuid,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addInvoice = async (req, res) => {
  try {
    const { amount, user_uuid } = req.body;
    const user = await findUserByUUID(user_uuid);
    const response = await Invoice.create({
      amount,
      userId: user.id,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const addInvoicePayment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const invoice = await findInvoiceByUUID(uuid);
    const response = await InvoicePayment.create({
      invoiceId: invoice.id,
      amount: invoice.amount,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const deleteInvoicePayment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const invoicePayment = await InvoicePayment.findOne({
      where: {
        uuid,
      },
    });
    const response = await invoicePayment.destroy();
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getUserInvoices = async (req, res) => {
  try {
    const { keyword } = req.query;
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await Invoice.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      where: {
        userId: user.id,
      },
      include: [InvoicePayment],
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

const getInvoices = async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await Invoice.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          where: {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
        },

        {
          model: InvoicePayment,
        },
      ],
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

const getInvoicesStats = async () => {
  try {
    // Count invoices and group them per day
    const response = await Invoice.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "invoicegedAt"], // Group by the date part of createdAt
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"], // Count invoices
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))], // Group by date
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]], // Optional: Order by date
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
const getInvoice = async (req, res) => {
  try {
    const { uuid } = req.params;
    const invoice = await Invoice.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, invoice);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteInvoice = async (req, res) => {
  try {
    const { uuid } = req.params;
    const invoice = await Invoice.findOne({
      where: {
        uuid,
      },
    });
    const response = await invoice.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editInvoice = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const invoice = await Invoice.findOne({
      where: {
        uuid,
      },
    });
    const response = await invoice.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addInvoice,
  deleteInvoice,
  editInvoice,
  addInvoicePayment,
  deleteInvoicePayment,
  getInvoicesStats,
  getUserInvoices,
  getInvoice,
  getInvoices,
  findInvoiceByUUID,
};
