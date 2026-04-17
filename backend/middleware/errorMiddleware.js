const AppError = require('../utils/appError');

const handleSequelizeValidationError = (err) => {
  const messages = err.errors.map((e) => e.message);
  return new AppError(`Validation error: ${messages.join('. ')}`, 400);
};

const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0]?.path || 'field';
  return new AppError(`Duplicate value for ${field}. Please use a different value.`, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, message: err.message });
  } else {
    console.error('UNEXPECTED ERROR:', err);
    res.status(500).json({ status: 'error', message: 'Something went wrong!' });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message };

    if (err.name === 'SequelizeValidationError') error = handleSequelizeValidationError(err);
    if (err.name === 'SequelizeUniqueConstraintError')
      error = handleSequelizeUniqueConstraintError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
