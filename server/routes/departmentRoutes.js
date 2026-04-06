const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/rbacMiddleware');
const { validateDepartment } = require('../middleware/validationMiddleware');

router.get('/', protect, getDepartments);
router.post('/', protect, authorize('Admin'), validateDepartment, createDepartment);
router.delete('/:id', protect, authorize('Admin'), deleteDepartment);

module.exports = router;
