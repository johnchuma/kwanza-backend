"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AudienceInterest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AudienceInterest.init(
    {
      audienceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      interest: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AudienceInterest",
    }
  );
  return AudienceInterest;
};
