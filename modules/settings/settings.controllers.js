const { Op } = require("sequelize");
const { Audience, AudienceInterest, User } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addRevivePublisherOrAffiliate,
} = require("../../utils/revive.controllers");
const { accountId, rtb } = require("../../utils/gooleAuthClients");
const setting = require("../../models/audience");
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
const updateSettings = async (req, res) => {
  try {
    const { name, country, pretarget, interests, user_uuid } = req.body;
    const user = await findUserByUUID(user_uuid);
    const setting = await Audience.create({
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

module.exports = {
  addAudience,
  deleteAudience,
  getPretargetedAudiences,
  editAudience,
  getAudience,
  getAudiences,
  findAudienceByUUID,
};
