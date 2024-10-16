const { Op } = require("sequelize");
const { errorResponse, successResponse } = require("../../utils/responses");
const {
  Agency,
  User,
  SSPCampaign,
  SSPCampaignBannerReport,
  SSPCampaignBanner,
  DSPCampaign,
  DSPCampaignReport,
} = require("../../models");
const { getLogsStats } = require("../logs/logs.controllers");
const {
  findDSPCampaignByUUID,
} = require("../dspCampaigns/dspCampaigns.controllers");
const {
  findSSPCampaignByUUID,
} = require("../sspCampaigns/sspCampaigns.controllers");

const adminDashboardStats = async (req, res) => {
  try {
    //get no of agency
    const agencies = await Agency.count();
    //get no of publishers
    const users = await User.count();
    const publishers = await User.count({
      where: {
        role: "publisher",
      },
    });
    const advertisers = await User.count({
      where: {
        role: "advertiser",
      },
    });
    const influencers = await User.count({
      where: {
        role: "influencer",
      },
    });
    const administrators = await User.count({
      where: {
        role: "admin",
      },
    });
    const agencyUsers = await User.count({
      where: {
        role: "agency user",
      },
    });

    const activeSSPCampaigns = await SSPCampaign.count({
      where: {
        expireTime: {
          [Op.lt]: new Date(),
        },
      },
    });

    const activeDSPCampaigns = await DSPCampaign.count({
      where: {
        expireDate: {
          [Op.lt]: new Date(),
        },
      },
    });
    const logsStats = await getLogsStats();
    const payload = {
      agencies,
      activeDSPCampaigns,
      activeSSPCampaigns,
      publishers,
      agencyUsers,
      administrators,
      influencers,
      advertisers,
      users,
      logsStats,
    };
    successResponse(res, payload);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const dspCampaignStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log("UUID", uuid);
    const campaign = await findDSPCampaignByUUID(uuid);
    const report = await DSPCampaignReport.findAll({
      where: {
        DSPCampaignId: campaign.id,
      },
    });

    const impressions = report.reduce((sum, item) => sum + item.impressions, 0);
    const clicks = report.reduce((sum, item) => sum + item.clicks, 0);
    const totalCTR = report.reduce((sum, item) => sum + item.CTR, 0);
    const buyerSpend = report.reduce((sum, item) => sum + item.buyerSpend, 0);
    const bidderSpend = report.reduce((sum, item) => sum + item.bidderSpend, 0);

    successResponse(res, {
      report,
      impressions,
      clicks,
      totalCTR,
      buyerSpend,
      bidderSpend,
    });
  } catch (error) {
    console.log(res, error);
    errorResponse(res, error);
  }
};

const sspCampaignStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    const campaign = await findSSPCampaignByUUID(uuid);
    console.log(campaign);
    const report = await SSPCampaignBannerReport.findAll({
      include: [
        {
          model: SSPCampaignBanner,
          include: [],
          where: {
            SSPCampaignId: campaign.id,
          },
        },
      ],
    });

    const impressions = report.reduce((sum, item) => sum + item.impressions, 0);
    const clicks = report.reduce((sum, item) => sum + item.clicks, 0);
    const totalCTR = report.reduce((sum, item) => sum + item.CTR, 0);
    // const buyerSpend = report.reduce((sum, item) => sum + item.buyerSpend, 0);
    // const bidderSpend = report.reduce((sum, item) => sum + item.bidderSpend, 0);

    successResponse(res, {
      report,
      impressions,
      clicks,
      totalCTR,
      //   buyerSpend,
      //   bidderSpend,
    });
  } catch (error) {
    console.log(res, error);
    errorResponse(res, error);
  }
};

module.exports = { adminDashboardStats, sspCampaignStats, dspCampaignStats };
