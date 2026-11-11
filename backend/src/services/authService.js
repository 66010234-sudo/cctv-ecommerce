const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const AppError = require('../utils/appError');

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

async function register({ name, email, password, phone }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
    throw new AppError('อีเมลนี้ถูกใช้งานแล้ว', 409);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, passwordHash, phone, role: 'CUSTOMER', cart: { create: {} } },
    select: { id: true, name: true, email: true, phone: true, role: true },
  });
  return { user, token: createToken(user) };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 401);
  }
  const { passwordHash, ...safeUser } = user;
  return { user: safeUser, token: createToken(user) };
}
module.exports = { register, login };
