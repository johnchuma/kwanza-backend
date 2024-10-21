"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TraditionalCampaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TraditionalCampaign.hasMany(models.TraditionalCampaignChannel, {
        onDelete: "CASCADE",
        hooks: true,
      });
      TraditionalCampaign.belongsTo(models.User);
      // define association here
    }
  }
  TraditionalCampaign.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      budget: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      activateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE,
      },
      expireTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TraditionalCampaign",
    }
  );
  return TraditionalCampaign;
};
