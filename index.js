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

app.use("/files", express.static("files"));
app.use("/extracted", express.static("extracted"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));

app.use("/users", UserRoutes);
app.use("/agencies", AgencyRoutes);
app.use("/websites", WebsitesRoutes);
app.use("/logs", LogsRoutes);
app.use("/invoices", InvoiceRoutes);
app.use("/users", LogsRoutes);
app.use("/zones", ZonesRoutes);
app.use("/ssp-campaign-banners", SSPCampaignBannerRoutes);
app.use("/dsp-campaign-banners", DSPCampaignBannerRoutes);
app.use("/ssp-campaigns", SSPCampaignsRoutes);
app.use("/dsp-campaigns", DSPCampaignsRoutes);
app.use("/website-categories", WebsiteCategoryRoutes);
app.use("/agency-users", AgencyUserRoutes);
app.use("/audiences", AudiencesRoutes);
app.use("/stats", StatsRoutes);

app.get("/", (req, res) => {
  try {
    res.send("Server is working fine");
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
