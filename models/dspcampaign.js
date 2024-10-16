"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DSPCampaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DSPCampaign.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      audienceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activateDate: {
        defaultValue: DataTypes.DATE,
        type: DataTypes.DATE,
      },
      expireDate: {
        defaultValue: DataTypes.DATE,
        type: DataTypes.DATE,
      },
      budget: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DSPCampaign",
    }
  );
  return DSPCampaign;
};
