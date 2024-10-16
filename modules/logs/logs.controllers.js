const { Op } = require("sequelize");
const { Log, User, Sequelize } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");
const {
  addRevivePublisherOrAffiliate,
} = require("../../utils/revive.controllers");
const findLogByUUID = async (uuid) => {
  try {
    const response = await Log.findOne({
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
const addLog = async (log, user) => {
  try {
    return await Log.create({
      log,
      userId: user.id,
    });
  } catch (error) {
    console.log(error);
  }
};
const getLogs = async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await Log.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      where: {
        log: {
          [Op.like]: `%${keyword}%`,
        },
      },
      include: [User],
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
const getLogsStats = async () => {
  try {
    // Count logs and group them per day
    const response = await Log.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "loggedAt"], // Group by the date part of createdAt
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"], // Count logs
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))], // Group by date
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]], // Optional: Order by date
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
const getLog = async (req, res) => {
  try {
    const { uuid } = req.params;
    const log = await Log.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, log);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteLog = async (req, res) => {
  try {
    const { uuid } = req.params;
    const log = await Log.findOne({
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
const editLog = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const log = await Log.findOne({
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
  addLog,
  deleteLog,
  editLog,
  getLogsStats,
  getLog,
  getLogs,
  findLogByUUID,
};
