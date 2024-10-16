"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SSPCampaignBannerReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SSPCampaignBannerReport.belongsTo(models.SSPCampaignBanner);
    }
  }
  SSPCampaignBannerReport.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      SSPCampaignBannerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      impressions: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      clicks: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      CTR: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "SSPCampaignBannerReport",
    }
  );
  return SSPCampaignBannerReport;
};
