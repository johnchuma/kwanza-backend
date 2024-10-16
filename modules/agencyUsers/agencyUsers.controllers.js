const { Op } = require("sequelize");
const { AgencyUser, User } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findAgencyByUUID } = require("../agencies/agencies.controllers");
const { checkIfUserExists } = require("../users/users.controllers");
const findAgencyUserByUUID = async (uuid) => {
  try {
    const response = await AgencyUser.findOne({
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
const addAgencyUser = async (req, res) => {
  try {
    const { name, email, phone, agency_uuid } = req.body;
    const agency = await findAgencyByUUID(agency_uuid);
    let user = await checkIfUserExists(email, phone);
    if (user) {
      res.status(401).json({
        status: false,
        message: "Email or phone number is already used",
      });
    } else {
      user = await User.create({
        name,
        email,
        phone,
        role: "agency user",
      });

      const response = await AgencyUser.create({
        agencyId: agency.id,
        userId: user.id,
      });
      successResponse(res, response);
    }
  } catch (error) {
    errorResponse(res, error);
  }
};
const getAgencyUsers = async (req, res) => {
  try {
    const { uuid } = req.params;
    const agency = await findAgencyByUUID(uuid);
    const response = await AgencyUser.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [User],
      where: {
        agencyId: agency.id,
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

const deleteAgencyUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const agencyuser = await AgencyUser.findOne({
      where: {
        uuid,
      },
    });
    const response = await agencyuser.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  addAgencyUser,
  deleteAgencyUser,
  getAgencyUsers,
  findAgencyUserByUUID,
};
