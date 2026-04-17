
module.exports = (sequelize, DataTypes) => {
  const LaundryOrders = sequelize.define(
    "LaundryOrders",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Customer name is required" } },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: "Phone number is required" } },
      },
      garments: {
        type: DataTypes.JSONB,
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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "complete", "canceled", "failed"),
        defaultValue: "pending",
      },
      orderStatus: {
        type: DataTypes.ENUM("RECEIVED", "PROCESSING", "READY", "DELIVERED"),
        defaultValue: "RECEIVED",
      },
    },
    {
      timestamps: true,
    },
  );

  

  return LaundryOrders;
};
