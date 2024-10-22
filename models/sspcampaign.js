"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SSPCampaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SSPCampaign.hasMany(models.SSPCampaignBanner, {
        onDelete: "CASCADE",
        hooks: true,
      });

      // define association here
    }
  }
  SSPCampaign.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviveSSPCampaignId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "draft",
      },
      type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      weight: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      revenue: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      revenueType: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      activateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE,
      },
      expireTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      targetImpression: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      targetClick: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "SSPCampaign",
    }
  );
  return SSPCampaign;
};
