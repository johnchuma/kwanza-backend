const { Op, Sequelize } = require("sequelize");
const {
  SSPCampaign,
  User,
  AdvertiserDetail,
  SSPCampaignBanner,
  SSPCampaignBannerReport,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const { findUserByUUID } = require("../users/users.controllers");
const { addReviveCampaign } = require("../../utils/revive.controllers");

const findSSPCampaignByUUID = async (uuid) => {
  try {
    const response = await SSPCampaign.findOne({
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
const addSSPCampaign = async (req, res) => {
  try {
    const {
      name,
      type,
      weight,
      revenue,
      revenueType,
      activateTime,
      expireTime,
      targetImpression,
      targetClick,
      user_uuid,
    } = req.body;
    console.log(name);
    const user = await User.findOne({
      where: {
        uuid: user_uuid,
      },
      include: [AdvertiserDetail],
    });
    console.log("payload", req.body);
    //create new one
    const reviveSSPCampaign = await addReviveCampaign(
      name,
      type,
      weight,
      user.AdvertiserDetail.clientId,
      revenue,
      revenueType,
      activateTime,
      expireTime,
      targetImpression,
      targetClick
    );
    console.log("Campaign", name);
    const response = await SSPCampaign.create({
      name,
      type,
      weight,
      userId: user.id,
      revenue,
      revenueType,
      activateTime,
      expireTime: expireTime || null,
      targetImpression,
      targetClick,
      reviveSSPCampaignId: reviveSSPCampaign.insertId,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getSSPCampaigns = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const { keyword } = req.query;

    const response = await SSPCampaign.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],

      where: {
        [Op.and]: [
          { userId: user.id },
          { name: { [Op.like]: `%${keyword}%` } },
        ],
      },
      attributes: {
        include: [
          // Total impressions: sum from related SSPCampaignBannerReport
          [
            Sequelize.literal(
              `(SELECT SUM(SSPCampaignBannerReports.impressions) 
                FROM SSPCampaignBannerReports
                JOIN SSPCampaignBanners ON SSPCampaignBanners.id = SSPCampaignBannerReports.SSPCampaignBannerId
                WHERE SSPCampaignBanners.SSPCampaignId = SSPCampaign.id)`
            ),
            "totalImpressions",
          ],
          // Total clicks: sum from related SSPCampaignBannerReport
          [
            Sequelize.literal(
              `(SELECT SUM(SSPCampaignBannerReports.clicks) 
                FROM SSPCampaignBannerReports
                JOIN SSPCampaignBanners ON SSPCampaignBanners.id = SSPCampaignBannerReports.SSPCampaignBannerId
                WHERE SSPCampaignBanners.SSPCampaignId = SSPCampaign.id)`
            ),
            "totalClicks",
          ],
          // Total CTR: average from related SSPCampaignBannerReport
          [
            Sequelize.literal(
              `(SELECT AVG(SSPCampaignBannerReports.CTR) 
                FROM SSPCampaignBannerReports
                JOIN SSPCampaignBanners ON SSPCampaignBanners.id = SSPCampaignBannerReports.SSPCampaignBannerId
                WHERE SSPCampaignBanners.SSPCampaignId = SSPCampaign.id)`
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

const getSSPCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const sspcampaign = await SSPCampaign.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, sspcampaign);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteSSPCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const sspcampaign = await SSPCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await sspcampaign.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editSSPCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const sspcampaign = await SSPCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await sspcampaign.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addSSPCampaign,
  deleteSSPCampaign,
  editSSPCampaign,
  getSSPCampaign,
  getSSPCampaigns,
  findSSPCampaignByUUID,
};
