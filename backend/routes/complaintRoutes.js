// Complaint routes
const express = require('express');
const router = express.Router();
const {
  addComplaint,
  getComplaints,
  searchComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// IMPORTANT: /search must come before /:id to avoid conflict
// GET /api/complaints/search?location=Ghaziabad
router.get('/search', protect, searchComplaints);

// POST /api/complaints - Add new complaint
router.post('/', protect, addComplaint);

// GET /api/complaints - Get all complaints (optional ?category= filter)
router.get('/', protect, getComplaints);

// GET /api/complaints/:id - Get single complaint
router.get('/:id', protect, getComplaintById);

// PUT /api/complaints/:id - Update complaint status
router.put('/:id', protect, updateComplaint);

// DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', protect, deleteComplaint);

module.exports = router;
