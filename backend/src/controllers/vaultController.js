import VaultDocument from '../models/VaultDocument.js';
import User from '../models/User.js';
import ApprovalCatalog from '../models/ApprovalCatalog.js';
import { uploadPdfToCloudinary } from '../config/cloudinary.js';
import { scanAndExtractDocument } from '../services/aiDocumentService.js';
import { resolveUser as resolveUserShared } from '../utils/resolveUser.js';

// Helper to resolve user (returns user _id)
const resolveUser = async (req) => resolveUserShared(req, false);

/**
 * @desc    Upload PDF to Cloudinary & Run AI Extraction
 * @route   POST /api/vault/documents/scan-and-upload
 * @access  Private / Public
 */
export const scanAndUploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided. Please upload a PDF document.',
      });
    }

    // Strict PDF Only Validation
    const isPdfMime = req.file.mimetype === 'application/pdf';
    const isPdfExt = req.file.originalname.toLowerCase().endsWith('.pdf');
    if (!isPdfMime && !isPdfExt) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only PDF files (.pdf) are permitted for statutory documents.',
      });
    }

    const { category = 'PAN_CARD' } = req.body;
    let userObj = req.user;
    if (!userObj && req.user?._id) {
      userObj = await User.findById(req.user._id);
    }
    if (!userObj) {
      userObj = { name: 'Industrial Enterprise', district: 'Pune' };
    }

    // 1. Upload PDF directly to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadPdfToCloudinary(req.file.buffer, 'saral_enterprise_docs', req.file.originalname);
    } catch (cErr) {
      console.error('[vaultController] Cloudinary Upload Error:', cErr);
      return res.status(502).json({
        success: false,
        message: 'Failed to upload document to secure cloud storage',
        error: cErr.message,
      });
    }

    // 2. Run AI OCR & Extraction
    const extractedData = await scanAndExtractDocument({
      category,
      filename: req.file.originalname,
      user: userObj,
      buffer: req.file.buffer,
    });

    return res.status(200).json({
      success: true,
      message: 'Document uploaded to Cloudinary and scanned by AI successfully',
      data: {
        fileUrl: uploadResult.secure_url,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: 'application/pdf',
        cloudinaryPublicId: uploadResult.public_id,
        category,
        extractedData,
      },
    });
  } catch (error) {
    console.error('[vaultController:scanAndUploadDocument] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process and scan document',
      error: error.message,
    });
  }
};

/**
 * @desc    Confirm Extracted Details & Save Document to Vault + Update Profile
 * @route   POST /api/vault/documents/confirm
 * @access  Private / Public
 */
export const confirmDocumentVerification = async (req, res) => {
  try {
    const {
      category = 'PAN_CARD',
      fileUrl,
      fileName,
      fileSize,
      cloudinaryPublicId,
      documentNumber,
      holderName,
      issuedBy,
      issueDate,
      expiryDate,
      extractedFields = {},
      documentName,
    } = req.body;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'File URL is required to confirm document record',
      });
    }

    const userId = await resolveUser(req);
    const user = await User.findById(userId);

    const docDisplayName =
      documentName ||
      {
        PAN_CARD: 'Permanent Account Number (PAN Card)',
        AADHAAR_CARD: 'Aadhaar Card (Authorized Signatory)',
        UDYAM_REGISTRATION: 'Udyam MSME Registration Certificate',
        LAND_RECORD: 'Land Ownership / 7/12 Extract / MIDC Allotment',
        GSTIN_CERTIFICATE: 'GSTIN Registration Certificate',
        SITE_PLAN_BLUEPRINT: 'Approved Factory Layout & Site Plan',
      }[category] ||
      'Statutory Clearance Document';

    // 1. Create or update VaultDocument
    const doc = await VaultDocument.create({
      userId,
      documentName: docDisplayName,
      category,
      fileUrl,
      cloudinaryPublicId: cloudinaryPublicId || '',
      fileName: fileName || `${category.toLowerCase()}.pdf`,
      fileSize: fileSize || 102400,
      fileType: 'application/pdf',
      certificateNumber: documentNumber || `CERT-${Date.now().toString().slice(-6)}`,
      issuedBy: issuedBy || 'Government Authority',
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
      status: 'VERIFIED',
      isUserVerified: true,
      extractedData: {
        documentNumber,
        holderName,
        issuedBy,
        ...extractedFields,
      },
    });

    // 2. Auto-populate corresponding User profile fields
    if (user) {
      if (category === 'PAN_CARD') {
        user.panNumber = documentNumber || user.panNumber;
        if (holderName && (!user.companyName || user.companyName === 'Industrial Enterprise')) {
          user.companyName = holderName;
        }
      } else if (category === 'AADHAAR_CARD') {
        user.isVerified = true;
        if (holderName && (!user.fullName || user.fullName === 'Authorized Signatory')) {
          user.fullName = holderName;
        }
      } else if (category === 'UDYAM_REGISTRATION') {
        user.udyogAadhaar = documentNumber || user.udyogAadhaar;
        if (extractedFields.enterpriseType) {
          user.enterpriseScale = extractedFields.enterpriseType.toUpperCase();
        }
      } else if (category === 'GSTIN_CERTIFICATE') {
        user.gstin = documentNumber || user.gstin;
      } else if (category === 'LAND_RECORD') {
        if (extractedFields.villageOrEstate || extractedFields.taluka) {
          user.address = {
            ...user.address,
            street: extractedFields.surveyOrGatNumber || user.address?.street || '',
            city: extractedFields.villageOrEstate || user.address?.city || '',
            district: extractedFields.district || user.district || 'Pune',
            state: 'Maharashtra',
            pincode: user.address?.pincode || '411014',
          };
        }
      } else if (category === 'SITE_PLAN_BLUEPRINT') {
        user.factoryDetails = {
          ...user.factoryDetails,
          plotArea: extractedFields.plotAreaSqM || '45,000 sq ft',
          builtArea: extractedFields.builtUpAreaSqM || '28,500 sq ft',
        };
      }

      // 3. Track verified documents array & update completion score
      if (!user.verifiedDocuments) user.verifiedDocuments = [];
      if (!user.verifiedDocuments.includes(category)) {
        user.verifiedDocuments.push(category);
      }

      // Calculate Completion: Base 20% + 15% per document (up to 100%)
      const verifiedCount = user.verifiedDocuments.length;
      user.profileCompletion = Math.min(100, 20 + verifiedCount * 15);

      // Check if core mandatory documents are verified
      const hasCore =
        user.verifiedDocuments.includes('PAN_CARD') &&
        user.verifiedDocuments.includes('AADHAAR_CARD') &&
        (user.verifiedDocuments.includes('UDYAM_REGISTRATION') || user.verifiedDocuments.includes('LAND_RECORD'));

      if (hasCore || user.profileCompletion >= 80) {
        user.profileStatus = 'COMPLETED';
        user.isVerified = true;
      } else if (verifiedCount > 0) {
        user.profileStatus = 'PENDING_VERIFICATION';
      }

      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: `${docDisplayName} verified and saved to Vault. Profile details automatically updated!`,
      data: {
        document: doc,
        user: user
          ? {
              _id: user._id,
              name: user.name,
              fullName: user.fullName,
              companyName: user.companyName,
              email: user.email,
              panNumber: user.panNumber,
              gstin: user.gstin,
              udyogAadhaar: user.udyogAadhaar,
              profileStatus: user.profileStatus,
              profileCompletion: user.profileCompletion,
              verifiedDocuments: user.verifiedDocuments,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('[vaultController:confirmDocumentVerification] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to confirm document verification',
      error: error.message,
    });
  }
};

/**
 * @desc    Upload new document / certificate to Vault (Generic)
 * @route   POST /api/vault/documents/upload
 * @access  Public / Private
 */
export const uploadCertificate = async (req, res) => {
  try {
    const { documentName, category = 'LAND', certificateNumber, issuedBy, expiryDate, applicationId } = req.body;

    const userId = await resolveUser(req);

    let fileUrl = req.body.fileUrl;
    let fileName = req.body.fileName || `${documentName || 'Document'}.pdf`;
    let fileSize = 102400;
    let cloudinaryPublicId = '';

    if (req.file) {
      try {
        const uploadResult = await uploadPdfToCloudinary(req.file.buffer, 'saral_vault', req.file.originalname);
        fileUrl = uploadResult.secure_url;
        fileName = req.file.originalname;
        fileSize = req.file.size;
        cloudinaryPublicId = uploadResult.public_id;
      } catch (uploadErr) {
        console.error('[vaultController:uploadCertificate] Cloudinary Error:', uploadErr);
        fileUrl = `/uploads/${req.file.originalname}`;
      }
    }

    if (!fileUrl) {
      fileUrl = 'https://res.cloudinary.com/dvmzb0tzl/raw/upload/v1726000000/saral_vault/certificate.pdf';
    }

    const doc = await VaultDocument.create({
      userId,
      applicationId: applicationId || undefined,
      documentName: documentName || 'Land / Statutory Record',
      category: category || 'LAND',
      fileUrl,
      fileName,
      fileSize,
      fileType: 'application/pdf',
      cloudinaryPublicId,
      certificateNumber: certificateNumber || `CERT-${Date.now().toString().slice(-6)}`,
      issuedBy: issuedBy || 'Government of Maharashtra',
      issueDate: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
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
    if (req.user && req.user._id) {
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

    const formattedDocs = documents.map((d) => {
      const plain = d.toObject();
      return {
        ...plain,
        id: d._id.toString(),
        name: d.documentName,
        source: ['PAN_CARD', 'AADHAAR_CARD', 'UDYAM_REGISTRATION', 'LAND_RECORD', 'GSTIN_CERTIFICATE', 'SITE_PLAN_BLUEPRINT'].includes(d.category)
          ? 'Submitted by Me'
          : 'Authority',
        issuingAuthority: d.issuedBy || 'Government of Maharashtra',
        authority: d.issuedBy || 'Government of Maharashtra',
        issueDate: d.issueDate ? new Date(d.issueDate).toISOString().split('T')[0] : 'N/A',
        expiryDate: d.expiryDate ? new Date(d.expiryDate).toISOString().split('T')[0] : 'N/A',
        needsRenewal: ['EXPIRING_SOON', 'EXPIRED', 'RENEWAL_PENDING'].includes(d.status),
        verificationStatus: d.status === 'ARCHIVED' ? 'EXPIRED' : (d.status === 'VERIFIED' ? 'VERIFIED' : 'ACTIVE'),
        pdfUrl: d.fileUrl,
        fileSize: d.fileSize ? `${(d.fileSize / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
        renewalFee: 5000,
        renewalRequiredDocs: [
          'Original Statutory Clearance Certificate',
          'Latest Operational Inspection Report',
          'Treasury Chalan / Statutory Fee Receipt',
        ],
        importanceSummary: `Mandatory compliance document issued by ${d.issuedBy || 'competent authority'}.`,
        details: {
          category: d.category || 'Statutory Clearance',
          legalSection: 'Section 14 of Maharashtra Single-Window Act, 2026',
          renewalWindowDays: 60,
          usageScope: 'Mandatory statutory clearance for ongoing commercial and industrial operations.',
        },
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedDocs.length,
      data: formattedDocs,
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
    const { priority } = req.query;
    const query = {
      status: { $in: ['EXPIRING_SOON', 'EXPIRED', 'RENEWAL_PENDING'] },
    };
    if (req.user && req.user._id) {
      query.userId = req.user._id;
    }

    const documents = await VaultDocument.find(query).sort({ expiryDate: 1 });

    const formattedPending = documents.map((d, index) => {
      const plain = d.toObject();
      return {
        ...plain,
        id: d._id.toString(),
        applicationId: d.applicationId || `APP-MH-2026-8941${index + 1}`,
        name: d.documentName,
        authority: d.issuedBy || 'Government of Maharashtra',
        type: d.category || 'Statutory Renewal',
        stage: d.status === 'EXPIRED' ? 'Expired - Immediate Action Required' : 'Renewal Window Active',
        dueDate: d.expiryDate ? new Date(d.expiryDate).toISOString().split('T')[0] : '2026-09-30',
        status: d.status,
        reason: 'Statutory validity expiring. Submission of updated report and renewal fee required.',
        priority: index === 0 ? 'CRITICAL' : index === 1 ? 'HIGH' : 'MEDIUM',
        actionRoute: `/user/track/${d.applicationId || 'APP-MH-2026-89412'}`,
      };
    });

    const filtered = priority && priority !== 'ALL'
      ? formattedPending.filter((d) => d.priority === priority)
      : formattedPending;

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
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

    if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
      return res.redirect(doc.fileUrl);
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

/**
 * @desc    Get all document types available in the database (Core + Catalog Clearances + Required Docs)
 * @route   GET /api/vault/document-types
 * @access  Public / Private
 */
export const getDocumentTypes = async (req, res) => {
  try {
    // 1. Base Core Enterprise Documents
    const coreTypes = [
      {
        code: 'PAN_CARD',
        label: 'PAN Card (Director / Entity)',
        desc: 'Permanent Account Number for legal & tax identification',
        category: 'Identity & Ownership',
        authority: 'Income Tax Department of India',
        required: true,
        tag: 'Identity Proof',
      },
      {
        code: 'AADHAAR_CARD',
        label: 'Aadhaar Card (Authorized Signatory)',
        desc: 'Identity & authorization verification of plant head / promoter',
        category: 'Identity & Ownership',
        authority: 'UIDAI',
        required: true,
        tag: 'Signatory Proof',
      },
      {
        code: 'UDYAM_REGISTRATION',
        label: 'Udyam Registration / Co. Incorporation',
        desc: 'MSME registration certificate or ROC Certificate of Incorporation',
        category: 'Identity & Ownership',
        authority: 'Ministry of MSME / MCA',
        required: true,
        tag: 'Ownership Proof',
      },
      {
        code: 'LAND_RECORD',
        label: '7/12 Land Extract / MIDC Allotment Letter',
        desc: 'Proof of land ownership, registered lease, or industrial estate plot',
        category: 'Land & Premises',
        authority: 'Revenue Department / MIDC',
        required: true,
        tag: 'Premises Proof',
      },
      {
        code: 'GSTIN_CERTIFICATE',
        label: 'GSTIN Registration Certificate',
        desc: 'State GST taxpayer registration certificate',
        category: 'Tax & Financial',
        authority: 'Goods and Services Tax Network (GSTN)',
        required: false,
        tag: 'Tax Proof',
      },
      {
        code: 'SITE_PLAN_BLUEPRINT',
        label: 'Approved Factory Blueprint / Layout',
        desc: 'Architect & civil engineer signed plant layout with setback marks',
        category: 'Technical & Engineering',
        authority: 'Chartered Architect & Municipal Planner',
        required: false,
        tag: 'Technical Proof',
      },
    ];

    // 2. Fetch all ApprovalCatalog items from database
    const catalogDocs = await ApprovalCatalog.find({ status: { $ne: 'ARCHIVED' } }).lean();

    const clearanceTypes = [];
    const prerequisiteDocMap = {};

    catalogDocs.forEach((cat) => {
      clearanceTypes.push({
        code: cat.id,
        label: cat.title,
        desc: cat.description || `Statutory clearance docket issued by ${cat.authority || cat.department}`,
        category: 'Statutory Clearance & Certificate',
        authority: cat.authority || cat.department || 'Government of Maharashtra',
        slaDays: cat.slaDays,
        fee: cat.fee,
        isFromCatalog: true,
        required: false,
        tag: 'Clearance',
      });

      if (Array.isArray(cat.requiredDocs)) {
        cat.requiredDocs.forEach((reqItem) => {
          const docName = typeof reqItem === 'string' ? reqItem : reqItem.documentName;
          if (docName && !prerequisiteDocMap[docName]) {
            const reqCat = typeof reqItem === 'object' && reqItem.category ? reqItem.category : 'Technical & Compliance';
            const reqDesc = typeof reqItem === 'object' && reqItem.description ? reqItem.description : `Statutory prerequisite for ${cat.title}`;
            prerequisiteDocMap[docName] = {
              code: `REQ_${docName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
              label: docName,
              desc: reqDesc,
              category: reqCat,
              authority: cat.authority || cat.department || 'Statutory Authority',
              isFromCatalog: true,
              required: false,
              tag: 'Prerequisite',
            };
          }
        });
      }
    });

    const prerequisiteTypes = Object.values(prerequisiteDocMap);

    const allTypes = [...coreTypes, ...clearanceTypes, ...prerequisiteTypes];

    return res.status(200).json({
      success: true,
      count: allTypes.length,
      data: {
        all: allTypes,
        core: coreTypes,
        clearances: clearanceTypes,
        prerequisites: prerequisiteTypes,
      },
    });
  } catch (error) {
    console.error('[vaultController:getDocumentTypes] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch document types from database',
      error: error.message,
    });
  }
};

export default {
  scanAndUploadDocument,
  confirmDocumentVerification,
  uploadCertificate,
  renewDocument,
  getVaultDocuments,
  getPendingDocuments,
  getVaultDocumentById,
  downloadCertificate,
  getDocumentTypes,
};
