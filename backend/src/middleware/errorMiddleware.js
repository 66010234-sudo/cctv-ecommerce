module.exports = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : error.message,
  });
};
