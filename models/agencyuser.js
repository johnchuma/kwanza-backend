"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AgencyUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AgencyUser.belongsTo(models.User);
      AgencyUser.belongsTo(models.Agency);
      // define association here
    }
  }
  AgencyUser.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AgencyUser",
    }
  );
  return AgencyUser;
};
