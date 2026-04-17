const { Op, fn, col, literal } = require("sequelize");
const { LaundryOrders: Order } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

exports.getDashboard = asyncHandler(async (req, res) => {
  const [totalOrders, revenueResult, statusCounts] = await Promise.all([
    Order.count(),

    Order.sum("totalAmount", {
      where: { paymentStatus: "complete" },
    }),

    Order.findAll({
      attributes: ["orderStatus", [fn("COUNT", col("id")), "count"]],
      group: ["orderStatus"],
      raw: true,
    }),
  ]);

  const ordersByStatus = { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 };
  statusCounts.forEach((row) => {
    ordersByStatus[row.orderStatus] = parseInt(row.count, 10);
  });

  const paymentBreakdown = await Order.findAll({
    attributes: ["paymentStatus", [fn("COUNT", col("id")), "count"]],
    group: ["paymentStatus"],
    raw: true,
  });

  const paymentByStatus = { pending: 0, complete: 0, canceled: 0, failed: 0 };
  paymentBreakdown.forEach((row) => {
    paymentByStatus[row.paymentStatus] = parseInt(row.count, 10);
  });

  res.status(200).json({
    status: "success",
    data: {
      totalOrders,
      totalRevenue: parseFloat(revenueResult || 0).toFixed(2),
      ordersByStatus,
      paymentByStatus,
    },
  });
});
