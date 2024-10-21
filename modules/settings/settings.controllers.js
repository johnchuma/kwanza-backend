const { Op } = require("sequelize");
const { Setting } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const updateSettings = async (req, res) => {
  try {
    const { amount } = req.body;
    const setting = await Setting.findOne();
    if (setting) {
      await setting.destroy();
    }
    const response = await Setting.create({
      publisherPayment: amount,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getSettings = async (req, res) => {
  try {
    const response = await Setting.findOne();
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getPublisherPayment = async () => {
  try {
    const response = await Setting.findOne();
    return response.publisherPayment || 0;
  } catch (error) {
    console.log(error);
    return error;
  }
};


module.exports = {
  updateSettings,
  getPublisherPayment,
  getSettings,
};
