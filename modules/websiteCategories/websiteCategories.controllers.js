const { Op } = require("sequelize");
const { WebsiteCategory } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const findWebsiteCategoryByUUID = async (uuid) => {
  try {
    const response = await WebsiteCategory.findOne({
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
const addWebsiteCategory = async (req, res) => {
  try {
    const { name, email } = req.body;
    const response = await WebsiteCategory.create({
      name,
      email,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getWebsiteCategories = async (req, res) => {
  try {
    const response = await WebsiteCategory.findAll();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getWebsiteCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const websitecategory = await WebsiteCategory.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, websitecategory);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteWebsiteCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const websitecategory = await WebsiteCategory.findOne({
      where: {
        uuid,
      },
    });
    const response = await websitecategory.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editWebsiteCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const websitecategory = await WebsiteCategory.findOne({
      where: {
        uuid,
      },
    });
    const response = await websitecategory.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addWebsiteCategory,
  deleteWebsiteCategory,
  editWebsiteCategory,
  getWebsiteCategory,
  getWebsiteCategories,
  findWebsiteCategoryByUUID,
};
