import VaultDocument from '../models/VaultDocument.js';
import User from '../models/User.js';

// Helper to resolve user
const resolveUser = async (req) => {
  if (req.user && req.user._id) return req.user._id;
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
  return demoUser._id;
};

/**
 * @desc    Upload new document / certificate to Vault
 * @route   POST /api/vault/documents/upload
 * @access  Public / Private
 */
export const uploadCertificate = async (req, res) => {
  try {
    const { documentName, category = 'LAND', certificateNumber, issuedBy, expiryDate, applicationId } = req.body;

    const userId = await resolveUser(req);

    // If file uploaded via multer or sent in body
    const fileUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.fileUrl || `https://storage.saral.gov.in/vault/${Date.now()}.pdf`;

    const fileName = req.file ? req.file.originalname : req.body.fileName || `${documentName || 'Document'}.pdf`;
    const fileSize = req.file ? req.file.size : 102400;
    const fileType = req.file ? req.file.mimetype : 'application/pdf';

    const doc = await VaultDocument.create({
      userId,
      applicationId: applicationId || undefined,
      documentName: documentName || 'Land / Statutory Record',
      category: category || 'LAND',
      fileUrl,
      fileName,
      fileSize,
      fileType,
      certificateNumber: certificateNumber || `CERT-${Date.now().toString().slice(-6)}`,
      issuedBy: issuedBy || 'Government of Maharashtra',
      issueDate: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // Default 5 years
      status: 'ACTIVE',
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate uploaded and secured in Enterprise Document Vault',
      data: doc,
    });
  } catch (error) {
    console.error('[vaultController:uploadCertificate] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload document to vault',
      error: error.message,
    });
  }
};

/**
 * @desc    Renew statutory document with UTR payment
 * @route   POST /api/vault/documents/:id/renew
 * @access  Public / Private
 */
export const renewDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { utrNumber, amount = 5000, remarks } = req.body;

    if (!utrNumber) {
      return res.status(400).json({
        success: false,
        message: 'utrNumber is required for statutory renewal',
      });
    }

    const doc = await VaultDocument.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { certificateNumber: id }],
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: `Vault document not found with ID: ${id}`,
      });
    }

    const newExpiryDate = new Date();
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 3);

    doc.renewalHistory.push({
      renewalDate: new Date(),
      utrNumber: utrNumber.trim(),
      amount: Number(amount),
      status: 'APPROVED',
      validUntil: newExpiryDate,
      remarks: remarks || 'Annual statutory renewal fee verified.',
    });

    doc.expiryDate = newExpiryDate;
    doc.status = 'RENEWED';
    await doc.save();

    return res.status(200).json({
      success: true,
      message: `Document renewed successfully until ${newExpiryDate.toISOString().split('T')[0]}. UTR: ${utrNumber}`,
      data: doc,
    });
  } catch (error) {
    console.error('[vaultController:renewDocument] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process document renewal',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all vault documents
 * @route   GET /api/vault/documents
 * @access  Public / Private
 */
export const getVaultDocuments = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    const query = {};
    if (req.user && req.user.role === 'USER') {
      query.userId = req.user._id;
    }
    if (category && category !== 'ALL') {
      query.category = category;
    }
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { documentName: new RegExp(search, 'i') },
        { certificateNumber: new RegExp(search, 'i') },
        { issuedBy: new RegExp(search, 'i') },
      ];
    }

    const documents = await VaultDocument.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error('[vaultController:getVaultDocuments] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vault documents',
      error: error.message,
    });
  }
};

/**
 * @desc    Get pending documents needing renewal
 * @route   GET /api/vault/pending-docs
 * @access  Public / Private
 */
export const getPendingDocuments = async (req, res) => {
  try {
    const documents = await VaultDocument.find({
      status: { $in: ['EXPIRING_SOON', 'EXPIRED', 'RENEWAL_PENDING'] },
    }).sort({ expiryDate: 1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error('[vaultController:getPendingDocuments] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending documents',
      error: error.message,
    });
  }
};

/**
 * @desc    Get vault document by ID
 * @route   GET /api/vault/documents/:id
 * @access  Public / Private
 */
export const getVaultDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await VaultDocument.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { certificateNumber: id }],
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: `Vault document not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error('[vaultController:getVaultDocumentById] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch document',
      error: error.message,
    });
  }
};

/**
 * @desc    Download certificate binary/blob
 * @route   GET /api/vault/documents/:id/download
 * @access  Public / Private
 */
export const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await VaultDocument.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { certificateNumber: id }],
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Set sample PDF headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName || 'certificate.pdf'}"`);
    return res.send(Buffer.from(`%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000102 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF`));
  } catch (error) {
    console.error('[vaultController:downloadCertificate] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to download certificate',
      error: error.message,
    });
  }
};

export default {
  uploadCertificate,
  renewDocument,
  getVaultDocuments,
  getPendingDocuments,
  getVaultDocumentById,
  downloadCertificate,
};
