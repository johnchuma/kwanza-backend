"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DSPCampaignReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DSPCampaignReport.belongsTo(models.DSPCampaign);
    }
  }
  DSPCampaignReport.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      DSPCampaignId: {
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
      buyerSpend: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      bidderSpend: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "DSPCampaignReport",
    }
  );
  return DSPCampaignReport;
};
