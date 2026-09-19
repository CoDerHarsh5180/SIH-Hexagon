import User from '../models/User.js';

/**
 * Shared helper to resolve the authenticated user or fall back to a demo user.
 * Used by controllers that need a user reference but may be called unauthenticated
 * during development/preview mode.
 *
 * @param {Object} req - Express request object
 * @param {boolean} returnFullDoc - If true, returns the full User document; if false, returns just the _id
 * @returns {Promise<Object|ObjectId>} User document or user _id
 */
export const resolveUser = async (req, returnFullDoc = false) => {
  if (req.user && req.user._id) {
    return returnFullDoc ? req.user : req.user._id;
  }

  // Lookup or create a default demo enterprise user
  let demoUser = await User.findOne({ email: 'applicant@saral.gov.in' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Sahyadri Agro Enterprises',
      fullName: 'Sahyadri Agro Enterprises',
      companyName: 'Sahyadri Agro Enterprises',
      email: 'applicant@saral.gov.in',
      phone: '+91 9822012345',
      password: 'password123',
      role: 'USER',
      industryType: 'Food Factory',
      district: 'Pune',
      isVerified: true,
      profileStatus: 'INCOMPLETE',
      profileCompletion: 20,
    });
  }

  return returnFullDoc ? demoUser : demoUser._id;
};

export default resolveUser;
