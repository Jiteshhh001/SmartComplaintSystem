// Complaint controller - Full CRUD + search/filter
const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const addComplaint = async (req, res, next) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
    });

    res.status(201).json({ message: 'Complaint stored successfully', complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (with optional category filter)
// @route   GET /api/complaints?category=Water Supply
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=Ghaziabad
// @access  Private
const searchComplaints = async (req, res, next) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: 'Location query parameter is required' });
    }

    // Case-insensitive partial match
    const complaints = await Complaint.find({
      location: { $regex: location, $options: 'i' },
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update only allowed fields
    if (req.body.status) complaint.status = req.body.status;
    if (req.body.aiAnalysis) complaint.aiAnalysis = req.body.aiAnalysis;

    const updatedComplaint = await complaint.save();
    res.json({ message: 'Complaint updated successfully', complaint: updatedComplaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  searchComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
