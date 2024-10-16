"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DSPCampaignBanner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DSPCampaignBanner.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      DSPCampaignId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      width: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      height: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      storageType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destinationURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DSPCampaignBanner",
    }
  );
  return DSPCampaignBanner;
};
