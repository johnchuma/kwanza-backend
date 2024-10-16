const { Op } = require("sequelize");
const {
  SSPCampaignBanner,
  Zone,
  Sequelize,
  BannerZone,
  SSPCampaign,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const { findUserByUUID } = require("../users/users.controllers");
const {
  deleteReviveSSPCampaignBanner,
  unlinkReviveZoneAndSSPCampaignBanner,
  addReviveBanner,
  linkZoneAndBanner,
  unlinkReviveZoneAndBanner,
  deleteReviveBanner,
} = require("../../utils/revive.controllers");
const {
  findSSPCampaignByUUID,
} = require("../sspCampaigns/sspCampaigns.controllers");
const {
  findZoneByUUID,
  findZonesByDimensions,
} = require("../zones/zones.controllers");

const findSSPCampaignBannerByUUID = async (uuid) => {
  try {
    const response = await SSPCampaignBanner.findOne({
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
const addSSPCampaignBanner = async (req, res) => {
  try {
    const { storageType, width, height, destinationURL, ssp_campaign_uuid } =
      req.body;
    const campaign = await findSSPCampaignByUUID(ssp_campaign_uuid);
    let url;

    if (storageType == "web") {
      url = req.fileLink;
    } else {
      url = req.extractedHtmlLink;
    }

    //create new one
    const reviveBanner = await addReviveBanner(
      campaign.reviveSSPCampaignId,
      storageType,
      width,
      height,
      storageType == "web" ? url : null,
      storageType == "html" ? url : null,
      destinationURL
    );

    const sspcampaignbanner = await SSPCampaignBanner.create({
      SSPCampaignId: campaign.id,
      storageType,
      width,
      height,
      destinationURL,
      url,
      reviveBannerId: reviveBanner.insertId,
    });

    //find zones and link
    const zones = await findZonesByDimensions(sspcampaignbanner);

    const promises = zones.map(async (zone) => {
      //link on revive
      const linkedZoneAndBanner = await linkZoneAndBanner(
        zone.reviveZoneId,
        sspcampaignbanner.reviveBannerId
      );
      return await BannerZone.create({
        zoneId: zone.id,
        SSPCampaignBannerId: sspcampaignbanner.id,
        reviveBannerZoneId: linkedZoneAndBanner.insertId,
      });
    });
    const response = await Promise.all(promises);

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const linkSSPCampaignBannerWithZone = async (req, res) => {
  try {
    const { zone_uuid, banner_uuid } = req.body;
    const zone = await findZoneByUUID(zone_uuid);
    const sspcampaignbanner = await findSSPCampaignBannerByUUID(banner_uuid);

    //Link zones and sspcampaignbanners in revive
    //console.log(zone, sspcampaignbanner);
    const linkedZoneBanner = await linkZoneAndBanner(
      zone.reviveZoneId,
      sspcampaignbanner.reviveBannerId
    );

    const response = await BannerZone.create({
      zoneId: zone.id,
      SSPCampaignBannerId: sspcampaignbanner.id,
      reviveBannerZoneId: linkedZoneBanner.insertId,
    });

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const unlinkSSPCampaignBannerWithZone = async (req, res) => {
  try {
    const { zone_uuid, banner_uuid } = req.body;
    const zone = await findZoneByUUID(zone_uuid);
    const sspcampaignbanner = await findSSPCampaignBannerByUUID(banner_uuid);
    console.log(zone, sspcampaignbanner);
    const bannerZone = await BannerZone.findOne({
      where: {
        [Op.and]: [
          {
            zoneId: zone.id,
          },
          {
            SSPCampaignBannerId: sspcampaignbanner.id,
          },
        ],
      },
    });
    console.log(bannerZone);
    //Link zones and sspcampaignbanners in revive
    //console.log(zone, sspcampaignbanner);
    await unlinkReviveZoneAndBanner(bannerZone.reviveBannerZoneId);
    const response = await bannerZone.destroy();

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getSSPCampaignBanners = async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log(uuid);
    const ssp_campaign = await findSSPCampaignByUUID(uuid);
    console.log("campaign", ssp_campaign);
    // Fetch sspcampaignbanners along with the linked zones count
    const response = await SSPCampaignBanner.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        SSPCampaignId: ssp_campaign.id,
      },
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["id"],
        include: [
          [
            Sequelize.literal(`(
                          SELECT COUNT(*)
                          FROM BannerZones
                          WHERE BannerZones.sspcampaignbannerId = SSPCampaignBanner.id
                      )`),
            "linkedZonesCount",
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

const getSSPCampaignBanner = async (req, res) => {
  try {
    const { uuid } = req.params;
    const sspcampaignbanner = await SSPCampaignBanner.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, sspcampaignbanner);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteSSPCampaignBanner = async (req, res) => {
  try {
    const { uuid } = req.params;
    const sspcampaignbanner = await SSPCampaignBanner.findOne({
      where: {
        uuid,
      },
    });
    await deleteReviveBanner(sspcampaignbanner.reviveBannerId);
    const response = await sspcampaignbanner.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editSSPCampaignBanner = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const sspcampaignbanner = await SSPCampaignBanner.findOne({
      where: {
        uuid,
      },
    });
    const response = await sspcampaignbanner.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  addSSPCampaignBanner,
  deleteSSPCampaignBanner,
  editSSPCampaignBanner,
  linkSSPCampaignBannerWithZone,
  unlinkSSPCampaignBannerWithZone,
  getSSPCampaignBanner,
  getSSPCampaignBanners,
  findSSPCampaignBannerByUUID,
};
