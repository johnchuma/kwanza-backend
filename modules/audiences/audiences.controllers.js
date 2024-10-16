const { Op } = require("sequelize");
const { Audience, AudienceInterest, User } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addRevivePublisherOrAffiliate,
} = require("../../utils/revive.controllers");
const { accountId, rtb } = require("../../utils/gooleAuthClients");
const audience = require("../../models/audience");
const findAudienceByUUID = async (uuid) => {
  try {
    const response = await Audience.findOne({
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
const addAudience = async (req, res) => {
  try {
    const { name, country, pretarget, interests, user_uuid } = req.body;
    const user = await findUserByUUID(user_uuid);
    const audience = await Audience.create({
      name,
      userId: user.id,
      country,
      pretarget,
    });
    const promises = interests.map(async (item) => {
      return await AudienceInterest.create({
        audienceId: audience.id,
        interest: item,
      });
    });
    await Promise.all(promises);
    successResponse(res, audience);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getPretargetedAudiences = async (req, res) => {
  try {
    const realtimebidding = await rtb();
    const response = await realtimebidding.bidders.pretargetingConfigs.list({
      parent: `bidders/${accountId}`,
    });
    successResponse(res, response.data);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getAudiences = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await Audience.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        [Op.and]: [
          {
            name: {
              [Op.like]: `%${req.keyword}%`,
            },
          },
          {
            userId: user.id,
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
const getAudience = async (req, res) => {
  try {
    const { uuid } = req.params;
    const log = await Audience.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, log);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteAudience = async (req, res) => {
  try {
    const { uuid } = req.params;
    const log = await Audience.findOne({
      where: {
        uuid,
      },
    });
    const response = await log.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editAudience = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const log = await Audience.findOne({
      where: {
        uuid,
      },
    });
    const response = await log.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addAudience,
  deleteAudience,
  getPretargetedAudiences,
  editAudience,
  getAudience,
  getAudiences,
  findAudienceByUUID,
};
