const express = require('express');
const router = express.Router();
const { addTenant, getTenantsByProperty, getAllTenants } = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addTenant);
router.get('/', protect, getAllTenants);
router.get('/:propertyId', protect, getTenantsByProperty);

module.exports = router;
