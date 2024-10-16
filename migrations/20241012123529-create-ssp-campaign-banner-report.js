"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("SSPCampaignBannerReports", {
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
      SSPCampaignBannerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      impressions: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      clicks: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      CTR: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
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
    await queryInterface.dropTable("SSPCampaignBannerReports");
  },
};
