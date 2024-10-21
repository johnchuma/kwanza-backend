const { Op } = require("sequelize");
const { Channel, User, Sequelize } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addRevivePublisherOrAffiliate,
} = require("../../utils/revive.controllers");
const { findAgencyByUUID } = require("../agencies/agencies.controllers");
const findChannelByUUID = async (uuid) => {
  try {
    const response = await Channel.findOne({
      where: {
        uuid,
      },
    });
    return response;
  } catch (error) {
    console.channel(error);
    throw error;
  }
};
const addChannel = async (req, res) => {
  try {
    const { name, media, agency_uuid } = req.body;
    const agency = await findAgencyByUUID(agency_uuid);
    const response = await Channel.create({
      name,
      media,
      agencyId: agency.id,
    });
    successResponse(res, response);
  } catch (error) {
    console.channel(error);
    errorResponse(res, error);
  }
};
const getChannels = async (req, res) => {
  try {
    const { keyword } = req.query;
    const { uuid } = req.params;
    const agency = await findAgencyByUUID(uuid);
    const response = await Channel.findAndCountAll({
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
            agencyId: agency.id,
          },
        ],
      },
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

const getChannel = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await Channel.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, channel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteChannel = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await Channel.findOne({
      where: {
        uuid,
      },
    });
    const response = await channel.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editChannel = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const channel = await Channel.findOne({
      where: {
        uuid,
      },
    });
    const response = await channel.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addChannel,
  deleteChannel,
  editChannel,
  getChannel,
  getChannels,
  findChannelByUUID,
};
