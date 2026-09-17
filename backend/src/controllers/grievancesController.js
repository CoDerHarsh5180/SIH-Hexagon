import Query from '../models/Query.js';
import Complaint from '../models/Complaint.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// Helper to resolve user
const resolveUser = async (req) => {
  if (req.user && req.user._id) return req.user;
  let demoUser = await User.findOne({ email: 'applicant@saral.gov.in' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Sahyadri Agro Enterprises',
      email: 'applicant@saral.gov.in',
      password: 'password123',
      role: 'USER',
      district: 'Pune',
    });
  }
  return demoUser;
};

// ── 1. QUERIES ──
export const submitQuery = async (req, res) => {
  try {
    const { department, query, district } = req.body;

    if (!department || !query) {
      return res.status(400).json({
        success: false,
        message: 'Department and query text are required',
      });
    }

    const user = await resolveUser(req);

    const newQuery = await Query.create({
      userId: user._id,
      userName: user.name || user.companyName || 'Applicant',
      userEmail: user.email,
      department,
      district: district || user.district || 'Pune',
      query: query.trim(),
      status: 'OPEN',
    });

    return res.status(201).json({
      success: true,
      message: 'Query submitted successfully to departmental officer',
      data: newQuery,
      queryId: newQuery.queryId,
    });
  } catch (error) {
    console.error('[grievancesController:submitQuery] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit query',
      error: error.message,
    });
  }
};

export const getUserQueries = async (req, res) => {
  try {
    const query = {};
    if (req.user && req.user.role === 'USER') {
      query.userId = req.user._id;
    }

    const queries = await Query.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: queries.length,
      data: queries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch queries',
      error: error.message,
    });
  }
};

export const getQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    const queryItem = await Query.findOne({
      $or: [{ queryId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!queryItem) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: queryItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch query',
      error: error.message,
    });
  }
};

// ── 2. COMPLAINTS ──
export const submitComplaint = async (req, res) => {
  try {
    const { applicationId, authority, department, district, complaintType, subject, description } = req.body;

    if (!authority || !complaintType || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Authority, complaintType, subject, and description are required',
      });
    }

    const user = await resolveUser(req);

    const newComplaint = await Complaint.create({
      userId: user._id,
      userName: user.name || user.companyName || 'Applicant',
      applicationId: applicationId || undefined,
      authority,
      department: department || authority,
      district: district || user.district || 'Pune',
      complaintType,
      subject,
      description,
      status: 'OPEN',
    });

    return res.status(201).json({
      success: true,
      message: 'Grievance complaint registered successfully. Tracking reference generated.',
      data: newComplaint,
      complaintId: newComplaint.complaintId,
    });
  } catch (error) {
    console.error('[grievancesController:submitComplaint] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register complaint',
      error: error.message,
    });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const { status, authority } = req.query;

    const query = {};
    if (req.user && req.user.role === 'USER') {
      query.userId = req.user._id;
    }
    if (status && status !== 'ALL') query.status = status;
    if (authority && authority !== 'ALL') query.authority = new RegExp(authority, 'i');

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    const formattedComplaints = complaints.map((c) => {
      const plain = c.toObject();
      return {
        ...plain,
        id: c.complaintId || c._id.toString(),
        appId: c.applicationId || 'APP-MH-2026-89412',
        enterprise: c.userName || 'Sahyadri Agro Foods Pvt. Ltd.',
        dateFiled: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '2026-09-02',
        slaCountdown: '2 Days Remaining for Response',
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedComplaints.length,
      data: formattedComplaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message,
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findOne({
      $or: [{ complaintId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message,
    });
  }
};

// ── 3. CITIZEN FEEDBACK ──
export const submitFeedback = async (req, res) => {
  try {
    const { department, district, applicationId, rating, comments } = req.body;

    if (!department || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Department and rating (1-5) are required',
      });
    }

    const user = await resolveUser(req);

    const feedback = await Feedback.create({
      userId: user._id,
      userName: user.name || 'Citizen',
      department,
      district: district || user.district || 'Pune',
      applicationId: applicationId || undefined,
      rating: Number(rating),
      comments: comments || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback recorded successfully. Thank you for helping improve SARAL.',
      data: feedback,
    });
  } catch (error) {
    console.error('[grievancesController:submitFeedback] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    });
  }
};

export const getFeedbackStats = async (req, res) => {
  try {
    const totalCount = await Feedback.countDocuments();
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$department',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalReviews: totalCount,
        departmentBreakdown: stats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate feedback statistics',
      error: error.message,
    });
  }
};

export default {
  submitQuery,
  getUserQueries,
  getQueryById,
  submitComplaint,
  getUserComplaints,
  getComplaintById,
  submitFeedback,
  getFeedbackStats,
};
