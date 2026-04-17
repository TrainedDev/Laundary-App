const { Op } = require("sequelize");
const { LaundryOrders: Order } = require("../models");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { customerName, phoneNumber, garments, paymentStatus, orderStatus } =
    req.body;

  if (
    !customerName ||
    !phoneNumber ||
    !garments ||
    !Array.isArray(garments) ||
    garments.length === 0
  ) {
    return next(
      new AppError(
        "customerName, phoneNumber, and garments are required.",
        400,
      ),
    );
  }

  const totalAmount = garments.reduce((sum, g) => {
    const qty = Number(g.quantity);
    const price = Number(g.pricePerItem);
    if (isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
      throw new AppError(
        "Each garment must have valid quantity and pricePerItem.",
        400,
      );
    }
    return sum + qty * price;
  }, 0);

  const order = await Order.create({
    customerName,
    phoneNumber,
    garments,
    totalAmount,
    paymentStatus: paymentStatus || "pending",
    orderStatus: orderStatus || "RECEIVED",
  });

  res.status(201).json({
    status: "success",
    data: {
      orderId: order.id,
      totalAmount: parseFloat(order.totalAmount),
    },
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { paymentStatus, orderStatus } = req.body;

  if (!paymentStatus && !orderStatus) {
    return next(
      new AppError(
        "Please provide paymentStatus or orderStatus to update.",
        400,
      ),
    );
  }

  const order = await Order.findByPk(id);
  if (!order) return next(new AppError("Order not found.", 404));

  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (orderStatus) order.orderStatus = orderStatus;

  await order.save();

  res.status(200).json({ status: "success", data: { order } });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const { customerName, phoneNumber, orderStatus } = req.query;
  const where = {};

  if (customerName) {
    where.customerName = { [Op.iLike]: `%${customerName}%` };
  }
  if (phoneNumber) {
    where.phoneNumber = { [Op.like]: `%${phoneNumber}%` };
  }
  if (orderStatus) {
    where.orderStatus = orderStatus.toUpperCase();
  }

  const orders = await Order.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: { orders },
  });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return next(new AppError("Order not found.", 404));
  res.status(200).json({ status: "success", data: { order } });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return next(new AppError("Order not found.", 404));
  await order.destroy();
  res.status(204).json({ status: "success", data: null });
});
