"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SSPCampaignBanner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SSPCampaignBanner.hasMany(models.BannerZone, {
        onDelete: "CASCADE",
        hooks: true,
      });
      SSPCampaignBanner.belongsTo(models.SSPCampaign, {
        onDelete: "CASCADE",
        hooks: true,
      });
      SSPCampaignBanner.hasMany(models.SSPCampaignBannerReport, {
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  SSPCampaignBanner.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      SSPCampaignId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      reviveBannerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SSPCampaignBanner",
    }
  );
  return SSPCampaignBanner;
};
