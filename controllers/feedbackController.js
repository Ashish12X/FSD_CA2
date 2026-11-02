const mongoose = require('mongoose');
const Feedback = require('../models/feedback');

exports.createFeedback = async (req, res) => {
  try {
    const { studentName, courseName, message, rating } = req.body;

    if (!studentName || !courseName || !message || rating === undefined) {
      return res.status(400).json({ success: false, error: 'studentName, courseName, message and rating are required' });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, error: 'rating must be a number between 1 and 5' });
    }

    const feedback = await Feedback.create({ studentName, courseName, message, rating: numericRating });
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: err.message });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ success: false, error: 'page and limit must be positive numbers' });
    }

    const skip = (page - 1) * limit;
    const totalRecords = await Feedback.countDocuments();
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      data: feedbacks
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid feedback id' });
    }

    if (!status || !['Pending', 'Reviewed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'status must be Pending or Reviewed' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.status(200).json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};