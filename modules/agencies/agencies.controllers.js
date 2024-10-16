const { Op } = require("sequelize");
const { Agency } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const findAgencyByUUID = async (uuid) => {
  try {
    const response = await Agency.findOne({
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
const addAgency = async (req, res) => {
  try {
    const { name, email } = req.body;
    const response = await Agency.create({
      name,
      email,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getAgencies = async (req, res) => {
  try {
    const response = await Agency.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
    });
    successResponse(res, {
      count: response.count || 0,
      page: req.page,
      rows: response.rows || [],
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
const getEgency = async (req, res) => {
  try {
    const { uuid } = req.params;
    const agency = await Agency.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, agency);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteAgency = async (req, res) => {
  try {
    const { uuid } = req.params;
    const agency = await Agency.findOne({
      where: {
        uuid,
      },
    });
    const response = await agency.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editAgency = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const agency = await Agency.findOne({
      where: {
        uuid,
      },
    });
    const response = await agency.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addAgency,
  deleteAgency,
  getAgencies,
  editAgency,
  getEgency,
  findAgencyByUUID,
};
