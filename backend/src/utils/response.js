// backend/src/utils/response.js

exports.success = (res, message, data = null) => {
  return res.json({
    success: true,
    message,
    data
  });
};

exports.error = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};