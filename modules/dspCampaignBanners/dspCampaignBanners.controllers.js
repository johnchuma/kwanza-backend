const { DSPCampaignBanner } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const {
  findDSPCampaignByUUID,
} = require("../dspCampaigns/dspCampaigns.controllers");

const findDSPCampaignBannerByUUID = async (uuid) => {
  try {
    const response = await DSPCampaignBanner.findOne({
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
const addDSPCampaignBanner = async (req, res) => {
  try {
    const { storageType, width, height, destinationURL, dsp_campaign_uuid } =
      req.body;
    const campaign = await findDSPCampaignByUUID(dsp_campaign_uuid);
    let url;

    if (storageType == "web") {
      url = req.fileLink;
    } else {
      url = req.extractedHtmlLink;
    }

    //create new one
    const response = await DSPCampaignBanner.create({
      DSPCampaignId: campaign.id,
      storageType,
      width,
      height,
      destinationURL,
      url,
    });

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getDSPCampaignBanners = async (req, res) => {
  try {
    const { uuid } = req.params;
    const dsp_campaign = await findDSPCampaignByUUID(uuid);
    const response = await DSPCampaignBanner.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        DSPCampaignId: dsp_campaign.id,
      },
      order: [["createdAt", "DESC"]],
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

const getDSPCampaignBanner = async (req, res) => {
  try {
    const { uuid } = req.params;
    const banner = await DSPCampaignBanner.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, banner);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteDSPCampaignBanner = async (req, res) => {
  try {
    const { uuid } = req.params;
    const banner = await DSPCampaignBanner.findOne({
      where: {
        uuid,
      },
    });
    const response = await banner.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editDSPCampaignBanner = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const banner = await DSPCampaignBanner.findOne({
      where: {
        uuid,
      },
    });
    const response = await banner.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  addDSPCampaignBanner,
  deleteDSPCampaignBanner,
  editDSPCampaignBanner,
  getDSPCampaignBanner,
  getDSPCampaignBanners,
  findDSPCampaignBannerByUUID,
};
