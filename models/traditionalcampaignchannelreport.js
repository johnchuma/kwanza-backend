"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TraditionalCampaignChannelReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TraditionalCampaignChannelReport.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      traditionalCampaignChannelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      count: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      impressions: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      AVE: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      spent: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      mention: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TraditionalCampaignChannelReport",
    }
  );
  return TraditionalCampaignChannelReport;
};
