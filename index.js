const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { SHA256 } = require("crypto-js");
const app = express();
const UserRoutes = require("./modules/users/users.routes");
const AgencyRoutes = require("./modules/agencies/agencies.routes");
const AgencyUserRoutes = require("./modules/agencyUsers/agencyUsers.routes");
const SSPCampaignBannerRoutes = require("./modules/sspCampaignBanners/sspCampaignBanners.routes");
const DSPCampaignBannerRoutes = require("./modules/dspCampaignBanners/dspCampaignBanners.routes");
const ZonesRoutes = require("./modules/zones/zones.routes");
const SSPCampaignsRoutes = require("./modules/sspCampaigns/sspCampaigns.routes");
const WebsitesRoutes = require("./modules/websites/websites.routes");
const LogsRoutes = require("./modules/logs/logs.routes");
const DSPCampaignsRoutes = require("./modules/dspCampaigns/dspCampaigns.routes");
const WebsiteCategoryRoutes = require("./modules/websiteCategories/websiteCategories.routes");
const AudiencesRoutes = require("./modules/audiences/audiences.routes");
const StatsRoutes = require("./modules/stats/stats.routes");
const InvoiceRoutes = require("./modules/invoices/invoices.routes");
const SettingsRoutes = require("./modules/settings/settings.routes");
const ChannelsRoutes = require("./modules/channels/channels.routes");
const TraditionalCampaignRoutes = require("./modules/traditionalCampaigns/traditionalCampaigns.routes");
const TraditionalCampaignChannelReportRoutes = require("./modules/traditionalCampaignChannelReports/traditionalCampaignChannelReports.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const {
  usersTag,
  agenciesTag,
  websitesTag,
  logsTag,
  invoicesTag,
  zonesTag,
  sspCampaignBannersTag,
  dspCampaignBannersTag,
  sspCampaignsTag,
  dspCampaignsTag,
  websiteCategoriesTag,
  agencyUsersTag,
  audiencesTag,
  statsTag,
  settingsTag,
  channelsTag,
  traditionalCampaignsTag,
  traditionalCampaignChannelReportTag,
} = require("./utils/apiSwaggerTags");

app.use("/files", express.static("files"));
app.use("/extracted", express.static("extracted"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));

app.use("/users", usersTag, UserRoutes);
app.use("/agencies", agenciesTag, AgencyRoutes);
app.use("/websites", websitesTag, WebsitesRoutes);
app.use("/logs", logsTag, LogsRoutes);
app.use("/invoices", invoicesTag, InvoiceRoutes);
app.use("/zones", zonesTag, ZonesRoutes);
app.use(
  "/ssp-campaign-banners",
  sspCampaignBannersTag,
  SSPCampaignBannerRoutes
);
app.use(
  "/dsp-campaign-banners",
  dspCampaignBannersTag,
  DSPCampaignBannerRoutes
);
app.use("/ssp-campaigns", sspCampaignsTag, SSPCampaignsRoutes);
app.use("/dsp-campaigns", dspCampaignsTag, DSPCampaignsRoutes);
app.use("/website-categories", websiteCategoriesTag, WebsiteCategoryRoutes);
app.use("/agency-users", agencyUsersTag, AgencyUserRoutes);
app.use("/audiences", audiencesTag, AudiencesRoutes);
app.use("/stats", statsTag, StatsRoutes);
app.use("/settings", settingsTag, SettingsRoutes);
app.use("/channels", channelsTag, ChannelsRoutes);
app.use(
  "/traditional-campaigns",
  traditionalCampaignsTag,
  TraditionalCampaignRoutes
);
app.use(
  "/traditional-campaign-channel-reports",
  traditionalCampaignChannelReportTag,
  TraditionalCampaignChannelReportRoutes
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  try {
    res.send("Server is working fine");
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
