"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("SSPCampaigns", {
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
    await queryInterface.dropTable("SSPCampaigns");
  },
};
