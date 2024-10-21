const { Op } = require("sequelize");
const {
  TraditionalCampaignChannelReport,
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
const {
  findTraditionalCampaignByUUID,
} = require("../traditionalCampaigns/traditionalCampaigns.controllers");
const traditionalcampaignchannel = require("../../models/traditionalcampaignchannel");
const findTraditionalCampaignChannelReportByUUID = async (uuid) => {
  try {
    const response = await TraditionalCampaignChannelReport.findOne({
      where: {
        uuid,
      },
    });
    return response;
  } catch (error) {
    console.traditionalcampaignchannelreport(error);
    throw error;
  }
};
const addTraditionalCampaignChannelReport = async (req, res) => {
  try {
    const {
      count,
      AVE,
      impressions,
      mention,
      spent,
      traditional_campaign_channel_uuid,
    } = req.body;
    const traditionalCampaignChannel = await TraditionalCampaignChannel.findOne(
      {
        where: {
          uuid: traditional_campaign_channel_uuid,
        },
      }
    );
    const response = await TraditionalCampaignChannelReport.create({
      count,
      AVE,
      impressions,
      mention,
      spent,
      traditionalCampaignChannelId: traditionalCampaignChannel.id,
    });

    successResponse(res, response);
  } catch (error) {
    console.traditionalcampaignchannelreport(error);
    errorResponse(res, error);
  }
};
const getTraditionalCampaignChannelReports = async (req, res) => {
  try {
    const { keyword } = req.query;
    const { uuid } = req.params;
    const traditionalCampaign = await findTraditionalCampaignByUUID(uuid);
    const response = await TraditionalCampaignChannelReport.findAndCountAll({
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
        ],
      },
      include: [
        {
          model: TraditionalCampaignChannel,
          where: {
            traditionalCampaignId: traditionalCampaign.id,
          },
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

const deleteTraditionalCampaignChannelReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const traditionalcampaignchannelreport =
      await TraditionalCampaignChannelReport.findOne({
        where: {
          uuid,
        },
      });
    const response = await traditionalcampaignchannelreport.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editTraditionalCampaignChannelReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const traditionalcampaignchannelreport =
      await TraditionalCampaignChannelReport.findOne({
        where: {
          uuid,
        },
      });
    const response = await traditionalcampaignchannelreport.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addTraditionalCampaignChannelReport,
  deleteTraditionalCampaignChannelReport,
  editTraditionalCampaignChannelReport,
  getTraditionalCampaignChannelReports,
  findTraditionalCampaignChannelReportByUUID,
};
