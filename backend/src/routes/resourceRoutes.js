const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const pending = (name) => (_req, res) => res.status(501).json({ success: false, message: `${name} API ยังไม่พร้อมใช้งาน` });

router.use('/products', pending('Products'));
router.use('/categories', pending('Categories'));
router.use('/cart', authenticate, pending('Cart'));
router.use('/orders', authenticate, pending('Orders'));
router.use('/payments', authenticate, pending('Payments'));
router.use('/deliveries', authenticate, authorize('ADMIN', 'DELIVERY_STAFF'), pending('Deliveries'));
module.exports = router;
