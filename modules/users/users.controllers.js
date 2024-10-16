const { Op, Sequelize } = require("sequelize");
const {
  User,
  Website,
  AgencyUser,
  SSPCampaign,
  DSPCampaign,
  Agency,
  AdvertiserDetail,
} = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { errorResponse, successResponse } = require("../../utils/responses");
const bcrypt = require("bcrypt");
const { randomNumber } = require("../../utils/random_number");
const { sendMail } = require("../../utils/mail_controller");
const { sendEmail } = require("../../utils/send_email");
const sendSMS = require("../../utils/send_sms");
const addPrefixToPhoneNumber = require("../../utils/add_number_prefix");
const {
  addRevivePublisherOrAffiliate,
  addReviveAdvertiser,
} = require("../../utils/revive.controllers");
const {
  findWebsiteCategoryByUUID,
} = require("../websiteCategories/websiteCategories.controllers");
const { findAgencyByUUID } = require("../agencies/agencies.controllers");
const { addLog } = require("../logs/logs.controllers");

const findUserByUUID = async (uuid) => {
  try {
    const user = await User.findOne({
      where: {
        uuid,
      },
      include: [
        {
          model: AgencyUser,
          include: [Agency],
        },
      ],
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const checkIfUserExists = async (email, phone) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        {
          email,
        },
        {
          phone,
        },
      ],
    },
  });
  return user;
};
const addUser = async (req, res) => {
  try {
    let { role, phone, name, email, company, agency_uuid } = req.body;
    let user = await checkIfUserExists(email, phone);
    if (user) {
      res.status(401).json({
        status: false,
        message: "Account already exist",
      });
    } else {
      const code = randomNumber();
      const user = await User.create({
        name,
        phone,
        password: code,
        email,
        role,
      });
      if (role == "advertiser") {
        const agency = await findAgencyByUUID(agency_uuid);
        const client = await addReviveAdvertiser(name, email);
        console.log(client);
        await AdvertiserDetail.create({
          clientId: client.insertId,
          agencyId: agency.id,
          contactName: client.name,
          officeEmail: client.email,
          company,
          userId: user.id,
        });
      }
      if (user.email) {
        console.log(user.email);
        const response = await sendEmail(user, "verification-code");
        console.log(response);
      } else {
        await sendSMS(
          addPrefixToPhoneNumber(user.phone),
          `Your Kwanza verification code is ${user.password} `
        );
      }
      successResponse(res, {
        message: "Verification code is sent successfully",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const confirmCode = async (req, res) => {
  try {
    let { email, phone, code } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            phone,
          },
          {
            email,
          },
        ],
      },
      include: [AdvertiserDetail],
    });
    if (user) {
      const result = user.password == code;
      if (result) {
        const tokens = generateJwtTokens(user);
        res.status(200).json({
          body: {
            tokens,
          },
          status: true,
        });
        await user.update({
          password: null,
        });
        await addLog("Logged in to the system", user);
      } else {
        res.status(401).send({
          status: false,
          message: "Wrong code or Already used",
        });
      }
    } else {
      res
        .status(404)
        .send({ status: false, message: "Account does not exist" });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    console.log(keyword);
    const response = await User.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
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
const getAdvertisers = async (req, res) => {
  try {
    const { uuid } = req.params;
    const agency = await findAgencyByUUID(uuid);
    const { keyword } = req.query;
    const response = await User.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        [Op.and]: [
          {
            role: "advertiser",
          },
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },

      include: [
        {
          model: AdvertiserDetail,
          where: {
            agencyId: agency.id,
          },
        },
      ],
      attributes: {
        exclude: ["id"],
        include: [
          [
            Sequelize.literal(
              `(SELECT COUNT(*) 
            FROM SSPCampaigns
            WHERE SSPCampaigns.userId = User.id)`
            ),
            "sspCampaigns",
          ],
          [
            Sequelize.literal(
              `(SELECT COUNT(*) 
            FROM DSPCampaigns
            WHERE DSPCampaigns.userId = User.id)`
            ),
            "dspCampaigns",
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
const getPublishers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await User.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        [Op.and]: [
          {
            role: "publisher",
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
            FROM Websites
            WHERE Websites.userId = User.id)`
            ),
            "websites",
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
const getInfluencers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await User.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        [Op.and]: [
          {
            role: "influencer",
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
const getUserInfo = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error);
  }
};
const sendCode = async (req, res) => {
  try {
    let { email, phone } = req.body;
    let user = await User.findOne({
      where: {
        [Op.or]: [
          {
            phone,
          },
          {
            email,
          },
        ],
      },
    });
    if (user) {
      const code = randomNumber();
      user = await user.update({
        password: code,
      });
      if (email) {
        await sendEmail(user, "verification-code");
      } else {
        await sendSMS(
          addPrefixToPhoneNumber(user.phone),
          `Your Kwanza verification code is ${user.password} `
        );
      }
      successResponse(res, {
        message: "Verification code is sent successfully",
      });
    } else {
      res
        .status(404)
        .send({ status: false, message: "Account does not exist" });
    }
  } catch (error) {
    errorResponse(res, error);
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = req.user;
    const response = await findUserByUUID(user.uuid);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const resetPassword = async (req, res) => {
  try {
    let { recoveryCode, password } = req.body;
    const { email } = req.params;
    let user = await User.findOne({
      where: {
        email,
      },
    });
    if (user.recoveryCode == recoveryCode) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      user = await user.update({
        password: hashedPassword,
        recoveryCode: null,
      });
      successResponse(res, user);
    } else {
      res.status(401).send({
        status: false,
        message: "Invalid recovery code",
      });
    }
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addUser,
  findUserByUUID,
  getUsers,
  confirmCode,
  deleteUser,
  getUserInfo,
  checkIfUserExists,
  getInfluencers,
  getAdvertisers,
  getPublishers,
  getMyInfo,
  updateUser,
  sendCode,
  resetPassword,
};
