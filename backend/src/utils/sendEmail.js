import nodemailer from 'nodemailer';

/**
 * Base email dispatcher
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!to) {
      console.warn('[Email] Skipping dispatch: No recipient email provided.');
      return { success: false, error: 'Recipient email missing' };
    }

    // If SMTP host and auth are configured in .env, send real email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const senderAddress = `"${process.env.FROM_NAME || 'SARAL Single-Window'}" <${process.env.SMTP_USER}>`;

      const info = await transporter.sendMail({
        from: senderAddress,
        replyTo: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
      });

      console.log(`[Email] Dispatched email to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      // In development / offline, log cleanly
      console.log('──────────────────────────────────────────────────────────');
      console.log(`[DEV Email Simulator] To: ${to}`);
      console.log(`[DEV Email Simulator] Subject: ${subject}`);
      console.log(`[DEV Email Simulator] Body:\n${text || html}`);
      console.log('──────────────────────────────────────────────────────────');
      return { success: true, isDevSimulated: true };
    }
  } catch (error) {
    console.error(`[Email] Delivery Error to ${to}:`, error.message);
    // Return gracefully so business operations are not aborted if email server is unreachable
    return { success: false, error: error.message };
  }
};

const getClientBaseUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

const emailWrapper = ({ title, preheader, contentHtml }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d47a1 0%, #1565c0 100%); padding: 28px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">SARAL Single-Window Portal</h1>
      <p style="color: #bfdbfe; margin: 0; font-size: 13px; font-weight: 400;">Government of Maharashtra • Industrial Clearances & Regulatory Approvals</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      ${preheader ? `<p style="color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 18px;">${preheader}</p>` : ''}
      ${contentHtml}
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0 0 4px 0;">This is an automated administrative notification from SARAL Single-Window Portal.</p>
      <p style="margin: 0;">Directorate of Industries & Regulatory Authorities, Government of Maharashtra.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * 1. Application Submission Confirmation
 */
export const sendApplicationSubmittedEmail = async ({
  to,
  applicantName,
  applicationId,
  verificationCode,
  title,
  authority,
  district,
  feePaid,
  slaDays = 30,
}) => {
  const trackingUrl = `${getClientBaseUrl()}/track?appId=${applicationId}`;
  const subject = `SARAL Application Filed: ${applicationId} (${title})`;

  const text = `Dear ${applicantName || 'Applicant'},\n\nYour application for '${title}' has been successfully submitted to ${authority} (${district || 'Maharashtra'}).\n\nApplication ID: ${applicationId}\nVerification PIN: ${verificationCode}\nStatutory SLA: ${slaDays} Days\nFee Paid: ₹${feePaid || 0}\n\nTrack your application at: ${trackingUrl}\n\nSARAL Single-Window Portal`;

  const contentHtml = `
    <div style="background-color: #eff6ff; border-left: 4px solid #0d47a1; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <span style="display: inline-block; font-size: 12px; font-weight: 700; color: #0d47a1; text-transform: uppercase; letter-spacing: 0.5px;">Application Submitted</span>
      <h2 style="color: #1e3a8a; font-size: 18px; margin: 6px 0 0 0;">${title}</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Dear <strong>${applicantName || 'Applicant'}</strong>,<br>
      Your statutory clearance application has been registered into the departmental scrutiny docket.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Application ID:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #0f172a; text-align: right; font-family: monospace; font-size: 14px;">${applicationId}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Verification PIN:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #0d47a1; text-align: right; font-family: monospace; font-size: 15px;">${verificationCode}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Competent Authority:</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0f172a; text-align: right;">${authority}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Statutory SLA:</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0f172a; text-align: right;">${slaDays} Business Days</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Fee Status:</td>
        <td style="padding: 8px 0; font-weight: 600; color: ${feePaid > 0 ? '#16a34a' : '#d97706'}; text-align: right;">
          ${feePaid > 0 ? `₹${feePaid} Paid` : 'Pending Payment'}
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${trackingUrl}" target="_blank" style="background-color: #0d47a1; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
        Track Live Application Status &rarr;
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html: emailWrapper({ title: subject, preheader: `Clearance Application ${applicationId} registered.`, contentHtml }),
  });
};

/**
 * 2. Fee Payment Acknowledgment
 */
export const sendPaymentConfirmedEmail = async ({
  to,
  applicantName,
  applicationId,
  title,
  utrNumber,
  amount,
  paymentMethod = 'UPI',
}) => {
  const trackingUrl = `${getClientBaseUrl()}/track?appId=${applicationId}`;
  const subject = `Fee Receipt Confirmed: ${applicationId} (₹${amount})`;

  const text = `Dear ${applicantName || 'Applicant'},\n\nYour statutory clearance fee of ₹${amount} for '${title}' has been verified.\n\nApplication ID: ${applicationId}\nUTR Reference: ${utrNumber}\nPayment Mode: ${paymentMethod}\nStatus: VERIFIED\n\nYour dossier has progressed to Document Scrutiny.\n\nSARAL Single-Window Portal`;

  const contentHtml = `
    <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <span style="display: inline-block; font-size: 12px; font-weight: 700; color: #16a34a; text-transform: uppercase;">Payment Verified</span>
      <h2 style="color: #14532d; font-size: 18px; margin: 6px 0 0 0;">₹${amount} Received</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Dear <strong>${applicantName || 'Applicant'}</strong>,<br>
      Your statutory treasury remittance has been reconciled and acknowledged.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Application ID:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #0f172a; text-align: right; font-family: monospace;">${applicationId}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Clearance Name:</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0f172a; text-align: right;">${title}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Bank UTR Number:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #16a34a; text-align: right; font-family: monospace;">${utrNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Next Stage:</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0d47a1; text-align: right;">Document Scrutiny</td>
      </tr>
    </table>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${trackingUrl}" target="_blank" style="background-color: #16a34a; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Live Status &rarr;
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html: emailWrapper({ title: subject, preheader: `Fee payment verified for ${applicationId}.`, contentHtml }),
  });
};

/**
 * 3. Scrutiny Decision Notification
 */
export const sendScrutinyDecisionEmail = async ({
  to,
  applicantName,
  applicationId,
  title,
  decision,
  remarks,
  rejectionReason,
  certificateUrl,
  signedDocId,
}) => {
  const trackingUrl = `${getClientBaseUrl()}/track?appId=${applicationId}`;
  const decisionUpper = (decision || '').toUpperCase();

  const isApproved = decisionUpper === 'APPROVED';
  const isDiscrepancy = decisionUpper === 'DISCREPANCY';

  const badgeColor = isApproved ? '#16a34a' : isDiscrepancy ? '#d97706' : '#dc2626';
  const bgLight = isApproved ? '#f0fdf4' : isDiscrepancy ? '#fffbeb' : '#fef2f2';

  const subject = `Clearance Scrutiny Update: ${applicationId} - ${decisionUpper}`;

  const text = `Dear ${applicantName || 'Applicant'},\n\nYour application for '${title}' has received a scrutiny decision: ${decisionUpper}.\n\nApplication ID: ${applicationId}\nRemarks: ${remarks || rejectionReason || 'Reviewed by Scrutiny Officer.'}\n${signedDocId ? `Digital Signature: ${signedDocId}\n` : ''}${certificateUrl ? `Certificate Link: ${certificateUrl}\n` : ''}\nPlease check your SARAL dashboard: ${trackingUrl}\n\nSARAL Single-Window Portal`;

  const contentHtml = `
    <div style="background-color: ${bgLight}; border-left: 4px solid ${badgeColor}; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <span style="display: inline-block; font-size: 12px; font-weight: 700; color: ${badgeColor}; text-transform: uppercase;">
        Decision: ${decisionUpper}
      </span>
      <h2 style="color: #0f172a; font-size: 18px; margin: 6px 0 0 0;">${title}</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Dear <strong>${applicantName || 'Applicant'}</strong>,<br>
      The competent local regulatory desk has processed your application scrutiny.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0; font-size: 13px;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #475569;">Scrutiny Officer Remarks:</p>
      <p style="margin: 0; color: #1e293b; font-style: italic;">
        "${rejectionReason || remarks || (isApproved ? 'All statutory checks cleared.' : 'Clarifications required.')}"
      </p>
      ${signedDocId ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">Digital Token ID: <strong style="font-family: monospace;">${signedDocId}</strong></p>` : ''}
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${trackingUrl}" target="_blank" style="background-color: ${badgeColor}; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
        ${isApproved ? 'View Issued Clearance Certificate' : isDiscrepancy ? 'Upload Clarification Documents' : 'Review Grounds & File Appeal'} &rarr;
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html: emailWrapper({ title: subject, preheader: `Scrutiny decision for ${applicationId}: ${decisionUpper}.`, contentHtml }),
  });
};

/**
 * 4. Field Inspection Scheduled
 */
export const sendInspectionScheduledEmail = async ({
  to,
  applicantName,
  applicationId,
  title,
  inspectionDate,
  inspectionTime = '11:00 AM',
  inspectorName,
  inspectorContact,
  instructions,
}) => {
  const trackingUrl = `${getClientBaseUrl()}/track?appId=${applicationId}`;
  const subject = `Field Inspection Scheduled: ${applicationId} (${inspectionDate})`;

  const text = `Dear ${applicantName || 'Applicant'},\n\nA field inspection has been scheduled for your application '${title}'.\n\nApplication ID: ${applicationId}\nDate: ${inspectionDate}\nTime: ${inspectionTime}\nInspector: ${inspectorName} (${inspectorContact || ''})\nInstructions: ${instructions || 'Ensure site engineer is present with architectural drawings.'}\n\nSARAL Single-Window Portal`;

  const contentHtml = `
    <div style="background-color: #fefce8; border-left: 4px solid #ca8a04; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <span style="display: inline-block; font-size: 12px; font-weight: 700; color: #ca8a04; text-transform: uppercase;">Field Inspection Scheduled</span>
      <h2 style="color: #713f12; font-size: 18px; margin: 6px 0 0 0;">${title}</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Dear <strong>${applicantName || 'Applicant'}</strong>,<br>
      An official field inspection has been scheduled to inspect your industrial premises.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Scheduled Date:</td>
        <td style="padding: 8px 0; font-weight: 700; color: #0f172a; text-align: right;">${inspectionDate} at ${inspectionTime}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Assigned Inspector:</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0f172a; text-align: right;">${inspectorName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Inspector Contact:</td>
        <td style="padding: 8px 0; font-weight: 600; color: #0d47a1; text-align: right;">${inspectorContact || '+91 22 2757 4410'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Site Instructions:</td>
        <td style="padding: 8px 0; font-weight: 500; color: #334155; text-align: right;">${instructions || 'Ensure site engineer is available with certified site blueprints.'}</td>
      </tr>
    </table>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${trackingUrl}" target="_blank" style="background-color: #0d47a1; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Inspection Dossier &rarr;
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html: emailWrapper({ title: subject, preheader: `Inspection scheduled for ${applicationId} on ${inspectionDate}.`, contentHtml }),
  });
};

/**
 * 5. Apex Central Sanction Notification
 */
export const sendCentralSanctionEmail = async ({
  to,
  applicantName,
  applicationId,
  title,
  action,
  sanctionId,
  signedDocId,
  remarks,
  grounds,
  rejectionReason,
}) => {
  const trackingUrl = `${getClientBaseUrl()}/track?appId=${applicationId}`;
  const isApproved = (action || '').toUpperCase() === 'APPROVED';

  const badgeColor = isApproved ? '#16a34a' : '#dc2626';
  const bgLight = isApproved ? '#f0fdf4' : '#fef2f2';
  const subject = `Apex Directorate Decision: ${applicationId} - ${action}`;

  const text = `Dear ${applicantName || 'Applicant'},\n\nThe Apex Directorate has processed final sanction for '${title}'.\n\nDecision: ${action}\nApplication ID: ${applicationId}\n${sanctionId ? `Sanction ID: ${sanctionId}\n` : ''}${signedDocId ? `DSC Token: ${signedDocId}\n` : ''}Remarks: ${remarks || rejectionReason || grounds || 'Statutory review completed.'}\n\nSARAL Single-Window Portal`;

  const contentHtml = `
    <div style="background-color: ${bgLight}; border-left: 4px solid ${badgeColor}; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <span style="display: inline-block; font-size: 12px; font-weight: 700; color: ${badgeColor}; text-transform: uppercase;">
        Apex Decision: ${action}
      </span>
      <h2 style="color: #0f172a; font-size: 18px; margin: 6px 0 0 0;">${title}</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Dear <strong>${applicantName || 'Applicant'}</strong>,<br>
      The Apex Regulatory Directorate has issued the official sanction order for your industrial project.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0; font-size: 13px;">
      ${sanctionId ? `<p style="margin: 0 0 6px 0;">Sanction Order ID: <strong style="font-family: monospace; color: #0d47a1;">${sanctionId}</strong></p>` : ''}
      ${signedDocId ? `<p style="margin: 0 0 6px 0;">Digital Signature Token: <strong style="font-family: monospace;">${signedDocId}</strong></p>` : ''}
      <p style="margin: 8px 0 0 0; color: #475569;">
        <strong>Details:</strong> ${remarks || rejectionReason || grounds || 'Final regulatory order issued.'}
      </p>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${trackingUrl}" target="_blank" style="background-color: ${badgeColor}; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Final Decision & Certificate &rarr;
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html: emailWrapper({ title: subject, preheader: `Apex decision on clearance ${applicationId}: ${action}.`, contentHtml }),
  });
};

/**
 * 6. Grievance / Complaint Registered
 */
export const sendComplaintSubmittedEmail = async ({
  to,
  userName,
  complaintId,
  subject: complaintSubject,
  authority,
}) => {
  const subject = `Grievance Registered: ${complaintId}`;

  const text = `Dear ${userName || 'Citizen'},\n\nYour grievance has been lodged under reference ID ${complaintId}.\n\nSubject: ${complaintSubject}\nDepartment: ${authority}\nStatus: OPEN\n\nOur nodal grievance officer will investigate and resolve this within statutory SLA limits.\n\nSARAL Single-Window Portal`;

  const contentHtml = `
    <div style="background-color: #eff6ff; border-left: 4px solid #0d47a1; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
      <span style="display: inline-block; font-size: 12px; font-weight: 700; color: #0d47a1; text-transform: uppercase;">Grievance Lodged</span>
      <h2 style="color: #1e3a8a; font-size: 18px; margin: 6px 0 0 0;">${complaintId}</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Dear <strong>${userName || 'Citizen'}</strong>,<br>
      Your grievance has been assigned to the designated Nodal Redressal Officer.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Ticket ID:</td>
        <td style="padding: 8px 0; font-weight: 700; font-family: monospace;">${complaintId}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;">Subject:</td>
        <td style="padding: 8px 0; font-weight: 600;">${complaintSubject}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Department:</td>
        <td style="padding: 8px 0; font-weight: 600;">${authority}</td>
      </tr>
    </table>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html: emailWrapper({ title: subject, preheader: `Grievance ${complaintId} assigned for redressal.`, contentHtml }),
  });
};

export default sendEmail;
