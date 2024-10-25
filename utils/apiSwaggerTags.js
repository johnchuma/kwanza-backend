const usersTag = (req, res, next) => {
  // #swagger.tags = ['Users']
  next();
};
const agenciesTag = (req, res, next) => {
  // #swagger.tags = ['Agencies']
  next();
};
const websitesTag = (req, res, next) => {
  // #swagger.tags = ['Websites']
  next();
};
const logsTag = (req, res, next) => {
  // #swagger.tags = ['Logs']
  next();
};
const invoicesTag = (req, res, next) => {
  // #swagger.tags = ['Invoices']
  next();
};
const zonesTag = (req, res, next) => {
  // #swagger.tags = ['Zones']
  next();
};
const sspCampaignBannersTag = (req, res, next) => {
  // #swagger.tags = ['SSP Campaign Banners']
  next();
};
const dspCampaignBannersTag = (req, res, next) => {
  // #swagger.tags = ['DSP Campaign Banners']
  next();
};
const sspCampaignsTag = (req, res, next) => {
  // #swagger.tags = ['SSP Campaigns']
  next();
};
const dspCampaignsTag = (req, res, next) => {
  // #swagger.tags = ['DSP Campaigns']
  next();
};
const websiteCategoriesTag = (req, res, next) => {
  // #swagger.tags = ['Website Categories']
  next();
};
const agencyUsersTag = (req, res, next) => {
  // #swagger.tags = ['Agency Users']
  next();
};
const audiencesTag = (req, res, next) => {
  // #swagger.tags = ['Audiences']
  next();
};
const statsTag = (req, res, next) => {
  // #swagger.tags = ['Stats']
  next();
};
const settingsTag = (req, res, next) => {
  // #swagger.tags = ['Settings']
  next();
};
const channelsTag = (req, res, next) => {
  // #swagger.tags = ['Channels']
  next();
};
const traditionalCampaignsTag = (req, res, next) => {
  // #swagger.tags = ['Traditional Campaigns']
  next();
};
const traditionalCampaignChannelReportTag = (req, res, next) => {
  // #swagger.tags = ['Traditional Campaign Channel Report']
  next();
};

module.exports = {
  usersTag,
  agenciesTag,
  agencyUsersTag,
  statsTag,
  websiteCategoriesTag,
  websitesTag,
  logsTag,
  invoicesTag,
  zonesTag,
  sspCampaignBannersTag,
  dspCampaignBannersTag,
  sspCampaignsTag,
  dspCampaignBannersTag,
  dspCampaignsTag,
  websiteCategoriesTag,
  agencyUsersTag,
  agencyUsersTag,
  audiencesTag,
  audiencesTag,
  settingsTag,
  channelsTag,
  traditionalCampaignsTag,
  traditionalCampaignChannelReportTag,
};
