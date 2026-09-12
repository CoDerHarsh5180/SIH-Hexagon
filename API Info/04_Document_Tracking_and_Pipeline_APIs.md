# 04. Document Tracking & Inter-Authority Pipeline APIs

Powers the real-time pipeline tracker (`/user/track/:id`) displaying node-by-node inter-authority progression (Desk Screening -> Field Inspection -> Legal/Fee -> Final Issuance), officer contact details, document attachments, SLA countdowns, and escalations.

---

## 1. Get Live Tracking Pipeline Details
- **Endpoint**: `/api/tracking/:id`
- **Method**: `GET`
- **Access**: Authenticated (`USER` / `LOCAL_AUTH` / `MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Route Parameters
- `id`: Application ID (e.g. `APP-MH-2026-89412`)

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tracking pipeline retrieved successfully",
  "data": {
    "applicationId": "APP-MH-2026-89412",
    "docName": "Consent to Establish (CTE) - Orange Category",
    "description": "Industrial statutory environmental permit for machinery setup and civil layout verification.",
    "dateApplied": "2026-08-12",
    "estimatedDate": "2026-09-28",
    "currentStatus": "UNDER_INSPECTION",
    "overallProgressPercent": 50,
    "slaRemainingDays": 16,
    "isSlaOverdue": false,
    "pipelineSteps": [
      {
        "id": "step-1",
        "roleKey": "user",
        "name": "User Submitted",
        "authorityName": "Applicant Submission",
        "contactPerson": "Self (Rajesh Sharma)",
        "phone": "+91 98765 43210",
        "office": "DocFlow Online Portal",
        "status": "COMPLETED",
        "completedDate": "2026-08-12",
        "remarks": "Application docket and uploaded attachments verified by system algorithms."
      },
      {
        "id": "step-2",
        "roleKey": "auth1",
        "name": "Auth 1: Desk Screening",
        "authorityName": "MPCB Sub-Regional Office",
        "contactPerson": "S. K. Kulkarni (Scrutiny Officer)",
        "phone": "+91 22 2757 2739",
        "office": "Room 304, Raigad Bhavan, CBD Belapur, Navi Mumbai",
        "status": "COMPLETED",
        "completedDate": "2026-08-18",
        "remarks": "Primary verification of manufacturing flowcharts and land tenure complete."
      },
      {
        "id": "step-3",
        "roleKey": "auth2",
        "name": "Auth 2: Field Inspection",
        "authorityName": "Field Technical Directorate",
        "contactPerson": "Anand Patil (Divisional Inspector)",
        "phone": "+91 22 2757 4410",
        "office": "Regional Industrial Safety Cell, Turbhe",
        "status": "IN_PROGRESS",
        "completedDate": null,
        "remarks": "Site visit scheduled. Officer reviewing air chimney coordinates and effluent disposal plan."
      },
      {
        "id": "step-4",
        "roleKey": "auth3",
        "name": "Auth 3: Legal & Fee Verification",
        "authorityName": "Treasury & GRAS Account Desk",
        "contactPerson": "V. R. Deshmukh (Account Officer)",
        "phone": "+91 22 2202 5543",
        "office": "Mantralaya GRAS Gateway Verification Unit, Fort, Mumbai",
        "status": "PENDING",
        "completedDate": null,
        "remarks": "Challan fee clearance pending inspection concurrence."
      },
      {
        "id": "step-5",
        "roleKey": "final",
        "name": "Final: Certificate Issuance",
        "authorityName": "Maharashtra Pollution Control Board HQ",
        "contactPerson": "Member Secretary",
        "phone": "+91 22 2401 0706",
        "office": "Kalpataru Point, 3rd Floor, Sion Circle, Mumbai",
        "status": "PENDING",
        "completedDate": null,
        "remarks": "Final tokenized digital signature with QR verification embedded on the certificate."
      }
    ],
    "submittedFiles": [
      {
        "name": "Industrial Site Plan Drawing.pdf",
        "size": "3.4 MB",
        "uploadedAt": "2026-08-12",
        "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/site_plan_001.pdf"
      },
      {
        "name": "Environmental Impact Assessment.pdf",
        "size": "6.1 MB",
        "uploadedAt": "2026-08-12",
        "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/eia_001.pdf"
      },
      {
        "name": "7_12 Land Extract Document.pdf",
        "size": "1.2 MB",
        "uploadedAt": "2026-08-12",
        "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/land_poss_001.pdf"
      }
    ]
  }
}
```

---

## 2. Public Tracking Lookup (No Login Required)
Enables applicants, auditors, or citizens to verify the live status of any clearance using their Application Reference ID and a security verification code.

- **Endpoint**: `/api/tracking/public-lookup`
- **Method**: `POST`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "applicationId": "APP-MH-2026-89412",
  "verificationCode": "4981"
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Clearance status retrieved",
  "data": {
    "applicationId": "APP-MH-2026-89412",
    "enterpriseName": "Sh**** Polymers Pvt Ltd",
    "docName": "Consent to Establish (CTE) - Orange Category",
    "issuingAuthority": "Maharashtra Pollution Control Board (MPCB)",
    "currentStage": "Auth 2: Field Inspection",
    "dateApplied": "2026-08-12",
    "status": "UNDER_INSPECTION",
    "statutorySlaDays": 30,
    "daysElapsed": 14
  }
}
```

---

## 3. Get Tracking Audit History
- **Endpoint**: `/api/tracking/:id/history`
- **Method**: `GET`
- **Access**: Authenticated
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Audit history fetched",
  "data": [
    {
      "timestamp": "2026-08-12T10:30:00.000Z",
      "action": "APPLICATION_SUBMITTED",
      "actor": "Rajesh Sharma (Applicant)",
      "notes": "Docket submitted with 3 attachments and GRAS Challan proof."
    },
    {
      "timestamp": "2026-08-14T11:15:00.000Z",
      "action": "SCRUTINY_STARTED",
      "actor": "S. K. Kulkarni (Scrutiny Officer)",
      "notes": "Docket allocated to Sub-Regional Desk Raigad-I."
    },
    {
      "timestamp": "2026-08-18T16:45:00.000Z",
      "action": "SCRUTINY_APPROVED",
      "actor": "S. K. Kulkarni (Scrutiny Officer)",
      "notes": "Desk scrutiny passed. Forwarded to Field Technical Directorate."
    },
    {
      "timestamp": "2026-08-22T09:00:00.000Z",
      "action": "FIELD_INSPECTION_SCHEDULED",
      "actor": "Anand Patil (Field Inspector)",
      "notes": "Site visit scheduled for 2026-09-15 at 11:30 AM."
    }
  ]
}
```

---

## 4. Trigger SLA Overdue Escalation
Automatically or manually triggers high-priority alerts to the Main Authority grievance cell when an application exceeds statutory Citizen Charter SLA limits.

- **Endpoint**: `/api/tracking/:id/escalate`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "currentStepId": "step-3",
  "daysOverdue": 6,
  "remarks": "Site inspection window closed 6 days ago without officer communication."
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Escalation registered. Nodal Officer and Main Authority Vigilance Cell notified.",
  "data": {
    "escalationId": "ESC-2026-00841",
    "applicationId": "APP-MH-2026-89412",
    "escalatedTo": "Joint Director, Technical Clearance Directorate",
    "escalatedAt": "2026-09-12T01:30:00.000Z"
  }
}
```
