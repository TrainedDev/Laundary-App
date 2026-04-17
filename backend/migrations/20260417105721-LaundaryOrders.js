"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LaundryOrders", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Customer name is required" } },
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Phone number is required" } },
      },
      garments: {
        type: Sequelize.JSONB,
        allowNull: false,
        validate: {
          isValidGarments(value) {
            if (!Array.isArray(value) || value.length === 0) {
              throw new Error("Garments must be a non-empty array");
            }
            value.forEach((g, i) => {
              if (!g.type || !g.quantity || !g.pricePerItem) {
                throw new Error(
                  `Garment at index ${i} missing required fields`,
                );
              }
              if (g.quantity <= 0 || g.pricePerItem < 0) {
                throw new Error(
                  `Garment at index ${i} has invalid quantity or price`,
                );
              }
            });
          },
        },
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM("pending", "complete", "canceled", "failed"),
        defaultValue: "pending",
      },
      orderStatus: {
        type: Sequelize.ENUM("RECEIVED", "PROCESSING", "READY", "DELIVERED"),
        defaultValue: "RECEIVED",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LaundryOrders");
  },
};
