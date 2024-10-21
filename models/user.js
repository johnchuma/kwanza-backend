"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.AdvertiserDetail, {
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasMany(models.Website, {
        onDelete: "CASCADE",
        hooks: true,
      });
      User.hasMany(models.Log);
      User.hasMany(models.TraditionalCampaign);
      User.hasOne(models.AgencyUser);
      User.hasMany(models.SSPCampaign);
      User.hasMany(models.DSPCampaign);
      User.hasMany(models.AgencyUser, {
        onDelete: "CASCADE",
        hooks: true,
      });
      // define association here
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "publisher",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
