require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/prisma');
const routes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error('กรุณากำหนด DATABASE_URL และ JWT_SECRET ในไฟล์ .env');
}

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'CCTV API is running' }));
app.use('/api', routes);
app.use((req, res) => res.status(404).json({ success: false, message: 'ไม่พบ API ที่ร้องขอ' }));
app.use(errorMiddleware);

const port = Number(process.env.PORT) || 5001;
const server = app.listen(port, () => console.log(`CCTV API listening on port ${port}`));
async function shutdown() {
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
module.exports = app;
