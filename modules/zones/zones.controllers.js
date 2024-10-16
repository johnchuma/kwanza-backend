const { Op } = require("sequelize");
const {
  Zone,
  BannerZone,
  Sequelize,
  Banner,
  SSPCampaignBanner,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const { findUserByUUID } = require("../users/users.controllers");
const { findWebsiteByUUID } = require("../websites/websites.controllers");
const { addReviveZone } = require("../../utils/revive.controllers");

const findZoneByUUID = async (uuid) => {
  try {
    const response = await Zone.findOne({
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
const addZone = async (req, res) => {
  try {
    const { name, width, height, website_uuid, type, pageUrl } = req.body;
    const website = await findWebsiteByUUID(website_uuid);

    //create new one
    const reviveZone = await addReviveZone(
      name,
      width,
      height,
      website.affiliateId
    );
    const response = await Zone.create({
      name,
      width,
      type,
      pageUrl,
      websiteId: website.id,
      height,
      reviveZoneId: reviveZone.insertId,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getZones = async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log("Getting zones");
    const website = await findWebsiteByUUID(uuid);
    const response = await Zone.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        [Op.and]: [
          {
            websiteId: website.id,
          },
          {
            name: {
              [Op.like]: `%${req.keyword}%`,
            },
          },
        ],
      },
      attributes: {
        exclude: ["id"],
      },
    });
    console.log(response);
    successResponse(res, {
      count: response.count,
      page: req.page,
      rows: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
const getZoneBanners = async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log(uuid);
    const zone = await findZoneByUUID(uuid);
    const response = await BannerZone.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "desc"]],
      where: {
        zoneId: zone.id,
      },
      include: [
        {
          model: SSPCampaignBanner,
          required: true,
        },
      ],
    });
    // Prepare the final response
    const result = {
      count: response.count,
      page: req.page,
      rows: response.rows,
    };

    successResponse(res, result);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getBannerZones = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Fetch the banner using the uuid
    const banner = await SSPCampaignBanner.findOne({
      where: {
        uuid,
      },
    });

    // Fetch all zones and include the isLinked attribute
    const response = await Zone.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        height: banner.height,
        width: banner.width,
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`EXISTS (
                            SELECT 1 FROM BannerZones 
                            WHERE BannerZones.zoneId = Zone.id 
                            AND BannerZones.SSPCampaignBannerId = ${banner.id}
                        )`),
            "isLinked",
          ],
        ],
      },
    });
    console.log("response", response);
    // Prepare the final response
    const result = {
      count: response.count,
      page: req.page,
      rows: response.rows,
    };

    successResponse(res, result);
  } catch (error) {
    errorResponse(res, error);
  }
};

const findZonesByDimensions = async (banner) => {
  try {
    // Fetch all zones and include the isLinked attribute
    const response = await Zone.findAll({
      where: {
        height: banner.height,
        width: banner.width,
      },
    });

    return response;
  } catch (error) {
    errorResponse(res, error);
  }
};

const getZone = async (req, res) => {
  try {
    const { uuid } = req.params;
    const zone = await Zone.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, zone);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteZone = async (req, res) => {
  try {
    const { uuid } = req.params;
    const zone = await Zone.findOne({
      where: {
        uuid,
      },
    });
    const response = await zone.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editZone = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const zone = await Zone.findOne({
      where: {
        uuid,
      },
    });
    const response = await zone.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addZone,
  deleteZone,
  editZone,
  findZonesByDimensions,
  getBannerZones,
  getZoneBanners,
  getZone,
  getZones,
  findZoneByUUID,
};
