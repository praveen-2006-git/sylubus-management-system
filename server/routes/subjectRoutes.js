const express = require('express');
const router = express.Router();
const multer = require('multer');

const { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/rbacMiddleware');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.get('/', protect, authorize('Admin', 'Faculty', 'Student'), getSubjects);
router.get('/:id', protect, authorize('Admin', 'Faculty', 'Student'), getSubjectById);

// Admin Only Routes
router.post('/', protect, authorize('Admin'), upload.single('pdf'), createSubject);
router.put('/:id', protect, authorize('Admin'), upload.single('pdf'), updateSubject);
router.delete('/:id', protect, authorize('Admin'), deleteSubject);

module.exports = router;
