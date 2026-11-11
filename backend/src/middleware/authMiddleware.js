const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
exports.authenticate = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new AppError('กรุณาเข้าสู่ระบบ', 401);
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { throw new AppError('Token ไม่ถูกต้องหรือหมดอายุ', 401); }
  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { id: true, name: true, email: true, phone: true, role: true },
  });
  if (!user) throw new AppError('ไม่พบบัญชีผู้ใช้', 401);
  req.user = user;
  next();
});
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new AppError('ไม่มีสิทธิ์เข้าถึงรายการนี้', 403));
  next();
};
