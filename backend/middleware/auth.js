const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
const ErrorHander = require("../utils/errorHander");
const User = require("../model/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  console.log(token)

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

