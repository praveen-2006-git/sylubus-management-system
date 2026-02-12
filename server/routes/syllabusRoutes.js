const express = require('express');
const router = express.Router();
const multer = require('multer');

const { getSyllabi, getSyllabusById, createSyllabus, updateSyllabus, deleteSyllabus } = require('../controllers/syllabusController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

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


router.get('/', protect, getSyllabi);
router.get('/:id', protect, getSyllabusById);
router.post('/', protect, adminOnly, upload.single('pdf'), createSyllabus);
router.put('/:id', protect, adminOnly, upload.single('pdf'), updateSyllabus);
router.delete('/:id', protect, adminOnly, deleteSyllabus);


module.exports = router;
