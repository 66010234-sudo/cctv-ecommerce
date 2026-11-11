const router = require('express').Router();
router.use('/auth', require('./authRoutes'));
router.use('/', require('./resourceRoutes'));
module.exports = router;
