const jwt = require("jsonwebtoken");
const { LaundryUsers: User } = require("../models");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const userObj = user.toJSON();
  delete userObj.password;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: userObj },
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email and password.", 400));
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new AppError("Email already in use.", 400));
  }

  const user = await User.create({ name, email, password, role });
  createSendToken(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 400));
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Incorrect email or password.", 401));
  }

  createSendToken(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res) => {
  const userObj = req.user.toJSON();
  delete userObj.password;
  res.status(200).json({ status: "success", data: { user: userObj } });
});
