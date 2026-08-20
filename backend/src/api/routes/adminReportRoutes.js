const express = require('express');
const router = express.Router();
const {
    getAllReports,
    getReportDetail,
    resolveReport,
    dismissReport
} = require('../controllers/adminReportController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/rbacMiddleware');

router.use(protect);
router.use(checkRole('admin', 'super_admin'));

router.get('/', getAllReports);
router.get('/:id', getReportDetail);
router.put('/:id/resolve', resolveReport);
router.put('/:id/dismiss', dismissReport);

module.exports = router;
