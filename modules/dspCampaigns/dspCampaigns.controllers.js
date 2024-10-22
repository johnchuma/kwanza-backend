const { Op } = require("sequelize");
const {
  DSPCampaign,
  User,
  Audience,
  AdvertiserDetail,
  Sequelize,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { google } = require("googleapis");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addReviveDSPCampaign,
  addCampaign,
  addReviveCampaign,
} = require("../../utils/revive.controllers");
const path = require("path");
const { findAudienceByUUID } = require("../audiences/audiences.controllers");

const findDSPCampaignByUUID = async (uuid) => {
  try {
    const response = await DSPCampaign.findOne({
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
const addDSPCampaign = async (req, res) => {
  try {
    const {
      name,
      destination,
      activateDate,
      expireDate,
      budget,
      user_uuid,
      audience_uuid,
    } = req.body;
    const user = await findUserByUUID(user_uuid);
    const audience = await findAudienceByUUID(audience_uuid);
    const response = await DSPCampaign.create({
      userId: user.id,
      audienceId: audience.id,
      name,
      destination,
      activateDate,
      expireDate,
      budget,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error.message);
    console.error("Invalid credentials or request error:", error);
  }
};

const getDSPCampaigns = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const { keyword } = req.query;
    const response = await DSPCampaign.findAndCountAll({
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
              `(SELECT SUM(DSPCampaignReports.impressions) 
              FROM DSPCampaignReports
              WHERE DSPCampaignReports.DSPCampaignId = DSPCampaign.id)`
            ),
            "totalImpressions",
          ],
          [
            Sequelize.literal(
              `(SELECT SUM(DSPCampaignReports.clicks) 
              FROM DSPCampaignReports
              WHERE DSPCampaignReports.DSPCampaignId = DSPCampaign.id)`
            ),
            "totalClicks",
          ],
          [
            Sequelize.literal(
              `(SELECT AVG(DSPCampaignReports.CTR) 
              FROM DSPCampaignReports
              WHERE DSPCampaignReports.DSPCampaignId = DSPCampaign.id)`
            ),
            "totalCTR",
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
const getDSPCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const dspCampaign = await DSPCampaign.findOne({
      where: {
        uuid,
      },
      include: [Audience, User],
    });
    successResponse(res, dspCampaign);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteDSPCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const dspCampaign = await DSPCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await dspCampaign.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editDSPCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    let data = req.body;
    if (data.audience_uuid) {
      const audience = await findAudienceByUUID(data.audience_uuid);
      data.audienceId = audience.id;
    }

    const dspCampaign = await DSPCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await dspCampaign.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addDSPCampaign,
  deleteDSPCampaign,
  editDSPCampaign,
  getDSPCampaign,
  getDSPCampaigns,
  findDSPCampaignByUUID,
};
