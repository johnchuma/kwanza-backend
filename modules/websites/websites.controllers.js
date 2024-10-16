const { Op, Sequelize } = require("sequelize");
const { Website } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const {
  findWebsiteCategoryByUUID,
} = require("../websiteCategories/websiteCategories.controllers");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addRevivePublisherOrAffiliate,
} = require("../../utils/revive.controllers");
const findWebsiteByUUID = async (uuid) => {
  try {
    const response = await Website.findOne({
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
const addWebsite = async (req, res) => {
  try {
    let { website, type, category_uuid, user_uuid } = req.body;
    const category = await findWebsiteCategoryByUUID(category_uuid);
    const user = await findUserByUUID(user_uuid);
    //create new account on revive
    const affiliate = await addRevivePublisherOrAffiliate(
      user.name,
      user.email,
      website
    );
    const response = await Website.create({
      affiliateId: affiliate.insertId,
      userId: user.id,
      categoryId: category.id,
      name: website,
      type,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getWebsites = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const { keyword } = req.query;
    const response = await Website.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        [Op.and]: [
          {
            userId: user.id,
          },
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: {
        exclude: ["id"],
        include: [
          [
            Sequelize.literal(
              `(SELECT COUNT(*) 
            FROM Zones
            WHERE Zones.websiteId = Website.id)`
            ),
            "zones",
          ],
        ],
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
const getWebsite = async (req, res) => {
  try {
    const { uuid } = req.params;
    const website = await Website.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, website);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteWebsite = async (req, res) => {
  try {
    const { uuid } = req.params;
    const website = await Website.findOne({
      where: {
        uuid,
      },
    });
    const response = await website.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editWebsite = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const website = await Website.findOne({
      where: {
        uuid,
      },
    });
    const response = await website.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addWebsite,
  deleteWebsite,
  editWebsite,
  getWebsite,
  getWebsites,
  findWebsiteByUUID,
};
