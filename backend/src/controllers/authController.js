const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) {
    throw new AppError('กรุณาระบุชื่อ อีเมล และรหัสผ่านอย่างน้อย 8 ตัวอักษร', 400);
  }
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, data });
});
exports.login = asyncHandler(async (req, res) => {
  if (!req.body.email || !req.body.password) throw new AppError('กรุณาระบุอีเมลและรหัสผ่าน', 400);
  const data = await authService.login(req.body);
  res.json({ success: true, data });
});
exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});
