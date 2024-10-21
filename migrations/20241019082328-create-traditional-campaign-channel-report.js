"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("TraditionalCampaignChannelReports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("TraditionalCampaignChannelReports");
  },
};
