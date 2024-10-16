"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BannerZone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BannerZone.belongsTo(models.SSPCampaignBanner);
      BannerZone.belongsTo(models.Zone);
    }
  }
  BannerZone.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      zoneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SSPCampaignBannerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviveBannerZoneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BannerZone",
    }
  );
  return BannerZone;
};
