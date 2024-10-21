const { Op } = require("sequelize");
const {
  TraditionalCampaign,
  TraditionalCampaignChannel,
  User,
  Sequelize,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addRevivePublisherOrAffiliate,
} = require("../../utils/revive.controllers");
const { findAgencyByUUID } = require("../agencies/agencies.controllers");
const { findChannelByUUID } = require("../channels/channels.controllers");
const findTraditionalCampaignByUUID = async (uuid) => {
  try {
    const response = await TraditionalCampaign.findOne({
      where: {
        uuid,
      },
    });
    return response;
  } catch (error) {
    console.traditionalcampaign(error);
    throw error;
  }
};
const addTraditionalCampaign = async (req, res) => {
  try {
    const {
      name,
      type,
      user_uuid,
      activateTime,
      expireTime,
      budget,
      channels,
    } = req.body;
    const user = await findUserByUUID(user_uuid);
    const response = await TraditionalCampaign.create({
      name,
      type,
      budget,
      activateTime,
      expireTime,
      userId: user.id,
    });
    const promises = channels.map(async (item) => {
      const channel = await findChannelByUUID(item);
      return await TraditionalCampaignChannel.create({
        traditionCampaignId: response.id,
        channelId: channel.id,
      });
    });
    await Promise.all(promises);
    successResponse(res, response);
  } catch (error) {
    console.traditionalcampaign(error);
    errorResponse(res, error);
  }
};
const getTraditionalCampaigns = async (req, res) => {
  try {
    const { keyword } = req.query;
    const { uuid } = req.params;
    const advertiser = await findUserByUUID(uuid);
    const response = await TraditionalCampaign.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      where: {
        [Op.and]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            userId: advertiser.id,
          },
        ],
      },
      include: [TraditionalCampaignChannel],
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

const getTraditionalCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const traditionalcampaign = await TraditionalCampaign.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, traditionalcampaign);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteTraditionalCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const traditionalcampaign = await TraditionalCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await traditionalcampaign.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editTraditionalCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const traditionalcampaign = await TraditionalCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await traditionalcampaign.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addTraditionalCampaign,
  deleteTraditionalCampaign,
  editTraditionalCampaign,
  getTraditionalCampaign,
  getTraditionalCampaigns,
  findTraditionalCampaignByUUID,
};
