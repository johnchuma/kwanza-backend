const { Op } = require("sequelize");
const { errorResponse, successResponse } = require("../../utils/responses");
const {
  Agency,
  AgencyUser,
  User,
  Zone,
  BannerZone,
  Website,
  Log,
  SSPCampaign,
  AdvertiserDetail,
  Invoice,
  InvoicePayment,
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
const { findUserByUUID } = require("../users/users.controllers");
const { getPublisherPayment } = require("../settings/settings.controllers");
const {
  isThisWeek,
  isThisYear,
  isThisMonth,
} = require("../../utils/dateFilters");

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
const advertiserDashboardStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { type } = req.query;
    let campaigns = 0;
    let impressions = 0;
    let clicks = 0;
    let spent = 0;
    let campaignsStats = [];
    const user = await findUserByUUID(uuid);
    if (type == "SSP") {
      campaigns = await SSPCampaign.count({
        where: {
          userid: user.id,
        },
      });
      const reports = await SSPCampaignBannerReport.findAll({
        include: [
          {
            model: SSPCampaignBanner,
            required: true,
            include: [
              {
                model: SSPCampaign,
                where: {
                  userId: user.id, // Filter by user ID
                },
                required: true, // Only include if the campaign exists for the user
                // Don't select campaign attributes
              },
            ],
          },
        ],
      });

      const sspCampaigns = await SSPCampaign.findAll({
        where: {
          userId: user.id,
        },
        include: [
          {
            model: SSPCampaignBanner,
            include: [
              {
                model: SSPCampaignBannerReport,
              },
            ],
          },
        ],
      });
      impressions = reports.reduce((prev, item) => prev + item.impressions, 0);
      spent = reports.reduce(
        (prev, item) =>
          prev +
          (item.impressions * item.SSPCampaignBanner.SSPCampaign.revenue) /
            1000,
        0
      );
      clicks = reports.reduce((prev, item) => prev + item.clicks, 0);
      campaignsStats = sspCampaigns.map((campaign) => {
        return {
          name: campaign.name,
          clicks: campaign.SSPCampaignBanners.reduce(
            (prev, item) =>
              prev +
              item.SSPCampaignBannerReports.reduce(
                (prev, item) => prev + item.clicks,
                0
              ),
            0
          ),
          impressions: campaign.SSPCampaignBanners.reduce(
            (prev, item) =>
              prev +
              item.SSPCampaignBannerReports.reduce(
                (prev, item) => prev + item.impressions,
                0
              ),
            0
          ),
          spent: campaign.SSPCampaignBanners.reduce(
            (prev, item) =>
              prev +
              item.SSPCampaignBannerReports.reduce(
                (prev, item) =>
                  prev + (item.impressions * campaign.revenue) / 1000,
                0
              ),
            0
          ).toFixed(2),
        };
      });
    } else {
      campaigns = await DSPCampaign.count({
        where: {
          userid: user.id,
        },
      });
      const reports = await DSPCampaignReport.findAll({
        include: [
          {
            model: DSPCampaign,
            where: {
              userId: user.id,
            },
          },
        ],
      });
      const dspCampaigns = await DSPCampaign.findAll({
        where: {
          userId: user.id,
        },
        include: [
          {
            model: DSPCampaignReport,
          },
        ],
      });
      clicks = reports.reduce((prev, item) => prev + item.clicks, 0);
      impressions = reports.reduce((prev, item) => prev + item.impressions, 0);
      spent = reports.reduce(
        (prev, item) => prev + (item.impressions * 2) / 1000,
        0
      );
      campaignsStats = dspCampaigns.map((item) => {
        return {
          name: item.name,
          clicks: item.DSPCampaignReports.reduce(
            (prev, item) => prev + item.clicks,
            0
          ),
          impressions: item.DSPCampaignReports.reduce(
            (prev, item) => prev + item.impressions,
            0
          ),
          spent: item.DSPCampaignReports.reduce(
            (prev, item) => prev + (item.impressions * 2) / 1000,
            0
          ),
        };
      });
    }

    const payload = {
      campaigns,
      impressions: Math.ceil(impressions),
      clicks: Math.ceil(clicks),
      spent: spent.toFixed(2),
      campaignsStats,
    };
    console.log(payload);
    successResponse(res, payload);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const agencyDashboardStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    let campaigns = 0;
    let activeCampaigns = 0;
    let agencyUsers = 0;
    let agencyAdvertisers = 0;
    const agency = await Agency.findOne({
      where: {
        uuid,
      },
      include: [
        {
          model: AgencyUser,
          include: [
            {
              model: User,
            },
          ],
        },
        {
          model: AdvertiserDetail,
          include: [
            {
              model: User,
              include: [
                {
                  model: SSPCampaign,
                },
                {
                  model: DSPCampaign,
                },
              ],
            },
          ],
        },
      ],
    });

    agencyUsers = agency.AgencyUsers.filter(
      (item) => item.User.role == "agency user"
    ).length;

    agencyAdvertisers = agency.AdvertiserDetails.length;

    campaigns = agency.AdvertiserDetails.reduce(
      (prev, item) =>
        prev + item.User.SSPCampaigns.length + item.User.DSPCampaigns.length,
      0
    );

    const today = new Date(); // Get today's date

    activeCampaigns = agency.AdvertiserDetails.reduce((prev, item) => {
      // Filter active SSP campaigns based on expireDate
      const activeSSPCampaigns = item.User.SSPCampaigns.filter(
        (campaign) => new Date(campaign.expireDate) >= today
      ).length;
      // Filter active DSP campaigns based on expireDate
      const activeDSPCampaigns = item.User.DSPCampaigns.filter(
        (campaign) => new Date(campaign.expireDate) >= today
      ).length;
      // Sum the active campaigns
      return prev + activeSSPCampaigns + activeDSPCampaigns;
    }, 0);

    const payload = {
      campaigns,
      activeCampaigns,
      agencyUsers,
      agencyAdvertisers,
      agency,
    };
    console.log(payload);
    successResponse(res, payload);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const agencyAdvertisersStats = async (req, res) => {
  try {
    const { uuid } = req.params;

    let activeAdvertisers = 0;
    let inactiveAdvertisers = 0;
    let withCampaigns = 0;
    let noCampaigns = 0;

    const advertisers = await User.findAll({
      include: [
        {
          model: AdvertiserDetail,
          required: true,
          include: [
            {
              model: Agency,
              required: true,
              where: { uuid },
            },
          ],
        },
        {
          model: SSPCampaign,
          include: [
            {
              model: SSPCampaignBanner,
              include: [
                {
                  model: SSPCampaignBannerReport,
                },
              ],
            },
          ],
        },
        {
          model: DSPCampaign,
          include: [
            {
              model: DSPCampaignReport,
            },
          ],
        },
        { model: Log },
      ],
    });

    const date = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(date.getMonth() - 3); // Subtract 3 months from today's date

    let advertiserCampaignSpent = advertisers.map((advertiser) => {
      let isActive = false;
      let sspSpent = 0; // To accumulate SSP campaign spent
      let dspSpent = 0; // To accumulate DSP campaign spent

      // Check if advertiser is active based on logs
      advertiser.Logs.forEach((log) => {
        const logDate = new Date(log.createdAt);
        if (logDate >= threeMonthsAgo && logDate <= date) {
          isActive = true;
        }
      });

      if (isActive) {
        activeAdvertisers++;
      } else {
        inactiveAdvertisers++;
      }

      // Calculate SSP campaign spent
      advertiser.SSPCampaigns.forEach((sspCampaign) => {
        sspCampaign.SSPCampaignBanners.forEach((banner) => {
          banner.SSPCampaignBannerReports.forEach((report) => {
            sspSpent += (report.impressions * sspCampaign.revenue) / 1000; // Impressions spend formula
          });
        });
      });

      // Calculate DSP campaign spent
      advertiser.DSPCampaigns.forEach((dspCampaign) => {
        dspCampaign.DSPCampaignReports.forEach((report) => {
          dspSpent += (report.impressions * 2) / 1000; // Impressions spend formula
        });
      });

      const totalCampaigns =
        advertiser.SSPCampaigns.length + advertiser.DSPCampaigns.length;
      if (totalCampaigns > 0) {
        withCampaigns++;
      } else {
        noCampaigns++;
      }

      // Add to advertiserCampaignsStats
      return {
        advertiser: advertiser.name,
        DSPCampaignsSpent: dspSpent.toFixed(2), // Total spent for DSP campaigns
        SSPCampaignsSpent: sspSpent.toFixed(2), // Total spent for SSP campaigns
        campaigns: totalCampaigns, // SSPCampaigns + DSPCampaigns
      };
    });

    const payload = {
      activeAdvertisers,
      inactiveAdvertisers,
      withCampaigns,
      noCampaigns,
      advertiserCampaignsStats: advertiserCampaignSpent, // Merging campaign stats and spent stats
    };
traditional
    console.log(payload);
    successResponse(res, payload);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const publisherDashboardStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const publisherPayment = await getPublisherPayment();
    //publisher zones
    const websites = await Website.findAll({
      include: [
        {
          model: Zone,
        },
      ],
      where: {
        userId: user.id,
      },
    });
    const payments = await InvoicePayment.findAll({
      include: [
        {
          model: Invoice,
          where: {
            userId: user.id,
          },
        },
      ],
    });
    const response = await Zone.findAll({
      attributes: {
        exclude: ["WebsiteId"],
      },
      include: [
        {
          attributes: {
            exclude: ["UserId"],
          },
          model: Website,
          where: {
            userId: user.id,
          },
        },
        {
          model: BannerZone,
          include: [
            {
              model: SSPCampaignBanner,
              required: true,
              include: [
                {
                  model: SSPCampaignBannerReport,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });

    const zones = response.length;
    const revenue = response.reduce(
      (prev, item) =>
        prev +
        item.BannerZones.reduce(
          (prev, item) =>
            prev +
            item.SSPCampaignBanner.SSPCampaignBannerReports.reduce(
              (prev, item) =>
                prev + Math.ceil(item.impressions) * publisherPayment,
              0
            ),
          0
        ),
      0
    );

    const zonesStats = response.map((item) => {
      return {
        zone: item.name,
        revenue: item.BannerZones.reduce(
          (prev, item) =>
            prev +
            item.SSPCampaignBanner.SSPCampaignBannerReports.reduce(
              (prev, item) =>
                prev + Math.ceil(item.impressions) * publisherPayment,
              0
            ),
          0
        ),
      };
    });

    const websiteZones = websites.map((item) => {
      return {
        website: item.name,
        zones: item.Zones.length,
      };
    });
    let paid = payments.reduce((prev, item) => prev + item.amount, 0);
    let balance = revenue - paid;
    const payload = {
      zones,
      revenue,
      paid,
      balance,
      zonesStats,
      websiteZones,
    };
    console.log(payload);
    successResponse(res, payload);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const publisherRevenueDashboardStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const publisherPayment = await getPublisherPayment();
    //publisher zones

    const response = await Zone.findAll({
      attributes: {
        exclude: ["WebsiteId"],
      },
      include: [
        {
          attributes: {
            exclude: ["UserId"],
          },
          model: Website,
          where: {
            userId: user.id,
          },
        },
        {
          model: BannerZone,
          include: [
            {
              model: SSPCampaignBanner,
              required: true,
              include: [
                {
                  model: SSPCampaignBannerReport,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    const totalRevenue = response.reduce(
      (prev, item) =>
        prev +
        item.BannerZones.reduce(
          (prev, item) =>
            prev +
            item.SSPCampaignBanner.SSPCampaignBannerReports.reduce(
              (prev, item) =>
                prev + Math.ceil(item.impressions) * publisherPayment,
              0
            ),
          0
        ),
      0
    );
    const zonesStats = response.map((item) => {
      return {
        zone: item.name,
        revenue: item.BannerZones.reduce(
          (prev, item) =>
            prev +
            item.SSPCampaignBanner.SSPCampaignBannerReports.reduce(
              (prev, item) =>
                prev + Math.ceil(item.impressions) * publisherPayment,
              0
            ),
          0
        ),
      };
    });
    const revenueTrend = [];
    response.forEach((item) => {
      item.BannerZones.forEach((item) => {
        item.SSPCampaignBanner.SSPCampaignBannerReports.forEach((item) => {
          revenueTrend.push({
            createdAt: item.createdAt,
            revenue: item.impressions * publisherPayment,
          });
        });
      });
    });

    const thisWeekRevenue = revenueTrend
      .filter((item) => isThisWeek(item.createdAt))
      .reduce((prev, item) => prev + item.revenue, 0);
    const thisMonthRevenue = revenueTrend
      .filter((item) => isThisMonth(item.createdAt))
      .reduce((prev, item) => prev + item.revenue, 0);
    const thisYearRevenue = revenueTrend
      .filter((item) => isThisYear(item.createdAt))
      .reduce((prev, item) => prev + item.revenue, 0);

    const payload = {
      totalRevenue,
      thisWeekRevenue: Math.ceil(thisWeekRevenue),
      thisMonthRevenue: Math.ceil(thisMonthRevenue),
      thisYearRevenue: Math.ceil(thisYearRevenue),
      zonesStats,
      revenueTrend,
    };
    console.log(payload);
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

module.exports = {
  adminDashboardStats,
  sspCampaignStats,
  agencyAdvertisersStats,
  agencyDashboardStats,
  publisherDashboardStats,
  publisherRevenueDashboardStats,
  advertiserDashboardStats,
  dspCampaignStats,
};
