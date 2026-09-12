# 03. Applications & Custom Apply APIs

Manages the complete lifecycle of clearance filings, custom non-catalog clearances, attachment dockets, treasury challan payments, applicant discrepancy corrections, and withdrawals.

---

## 1. Submit Clearance Application
- **Endpoint**: `/api/applications`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json` (or `multipart/form-data`)

### Request Body JSON Format
```json
{
  "approvalId": "APP-ENV-001",
  "enterpriseProfileId": "usr_678a12bc90ef",
  "applicantDetails": {
    "applicantName": "Rajesh Kumar Sharma",
    "designation": "Managing Director",
    "phone": "+919876543210",
    "email": "rajesh@sharmaenterprises.in"
  },
  "industrialDetails": {
    "unitName": "Sharma Polymers - Unit II",
    "plotNumber": "Plot A-44/2",
    "industrialArea": "Taloja MIDC",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "410208",
    "manufacturingActivity": "Recycled Plastic Granule Extrusion",
    "productionCapacityTPA": 1500,
    "connectedLoadKW": 95,
    "waterRequirementKLD": 22
  },
  "attachments": [
    {
      "docCode": "SITE_PLAN",
      "fileName": "Site_Plan_Sharma_Polymers.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/site_plan_001.pdf",
      "fileSizeBytes": 3450210
    },
    {
      "docCode": "EIA_REPORT",
      "fileName": "ETP_Design_and_EIA_Summary.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/eia_001.pdf",
      "fileSizeBytes": 6120400
    },
    {
      "docCode": "LAND_POSSESSION",
      "fileName": "MIDC_Possession_Receipt.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/land_poss_001.pdf",
      "fileSizeBytes": 1289000
    }
  ],
  "feePayment": {
    "challanNumber": "MH-GRAS-2026-9812401",
    "amountPaidInr": 45000,
    "paymentDate": "2026-09-11",
    "bankReferenceNumber": "SBIN0001429812",
    "paymentReceiptUrl": "https://storage.docflow.gov.in/uploads/challans/gras_receipt.pdf"
  }
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Application submitted successfully and routed to Local Authority Desk Screening",
  "data": {
    "applicationId": "APP-MH-2026-89412",
    "approvalId": "APP-ENV-001",
    "approvalTitle": "Consent to Establish (CTE) - Orange Category",
    "currentStage": "AUTH_1_DESK_SCREENING",
    "status": "UNDER_REVIEW",
    "assignedAuthority": "Maharashtra Pollution Control Board - Raigad Regional Office",
    "submissionDate": "2026-09-12T01:30:00.000Z",
    "estimatedCompletionDate": "2026-10-12T01:30:00.000Z",
    "trackingUrl": "/user/track/APP-MH-2026-89412"
  }
}
```

---

## 2. Submit Custom Apply (Unlisted Statutory Clearance)
Allows enterprises to apply for non-standard statutory clearances, municipal permits, or special exemptions.

- **Endpoint**: `/api/applications/custom-apply`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "customDocTitle": "Special Groundwater Extraction & Hydrogeological Clearance",
  "targetDepartment": "Central Ground Water Authority (CGWA) / State Water Resources Desk",
  "category": "UTILITY",
  "urgency": "HIGH",
  "justification": "Industrial borewell installation required for cooling tower feed water.",
  "requestedValidityYears": 3,
  "applicantDetails": {
    "contactPerson": "Rajesh Kumar Sharma",
    "phone": "+919876543210",
    "email": "rajesh@sharmaenterprises.in"
  },
  "industrialDetails": {
    "plotNumber": "Plot A-44/2",
    "industrialArea": "Taloja MIDC",
    "district": "Raigad",
    "waterRequirementKLD": 25
  },
  "attachments": [
    {
      "docTitle": "Hydrogeological Borewell Survey Report",
      "fileName": "CGWA_Hydro_Survey.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/custom/cgwa_survey.pdf"
    }
  ]
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Custom application docket registered and assigned to Directorate Scrutiny Cell",
  "data": {
    "applicationId": "APP-MH-2026-89415",
    "customDocTitle": "Special Groundwater Extraction & Hydrogeological Clearance",
    "status": "SUBMITTED",
    "assignedAuthority": "Central Ground Water Authority",
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 3. Get User Applications List
- **Endpoint**: `/api/applications`
- **Method**: `GET`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `status` | String | No | Filter by clearance status | `UNDER_REVIEW`, `APPROVED`, `DISCREPANCY`, `REJECTED` |
| `page` | Integer | No | Page number (default: 1) | `1` |
| `limit` | Integer | No | Records per page (default: 10) | `10` |
| `search` | String | No | Search by doc title or App ID | `APP-MH-2026` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User applications fetched successfully",
  "data": [
    {
      "applicationId": "APP-MH-2026-89412",
      "docName": "Consent to Establish (CTE) - Orange Category",
      "authority": "Maharashtra Pollution Control Board (MPCB)",
      "dateApplied": "2026-08-12",
      "estimatedDate": "2026-09-28",
      "status": "UNDER_INSPECTION",
      "currentStageName": "Auth 2: Field Inspection",
      "feePaid": 45000
    }
  ],
  "pagination": {
    "total": 4,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 4. Respond to Scrutiny Discrepancy
When an authority scrutiny officer marks a discrepancy on an application, the user submits revised files and clarifications through this endpoint.

- **Endpoint**: `/api/applications/:id/discrepancy-response`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Route Parameters
- `id`: Unique application identifier (e.g. `APP-MH-2026-89412`)

### Request Body JSON Format
```json
{
  "stepId": "step-2",
  "discrepancyId": "DISC-MPCB-004",
  "applicantRemarks": "Updated effluent recycling schematic attached with revised ETP capacity specifications.",
  "revisedFiles": [
    {
      "docCode": "EIA_REPORT",
      "fileName": "Revised_ETP_Schematic_v2.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/revised/etp_v2.pdf",
      "fileSizeBytes": 4510200
    }
  ]
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Discrepancy reply submitted. Docket re-queued for officer review.",
  "data": {
    "applicationId": "APP-MH-2026-89412",
    "updatedStatus": "RECHECK_IN_PROGRESS",
    "resubmittedAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 5. Submit Fee Payment / Challan Proof
- **Endpoint**: `/api/applications/:id/fee-payment`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "challanNumber": "MH-GRAS-2026-78412",
  "amountPaidInr": 15000,
  "paymentDate": "2026-09-12",
  "paymentMethod": "NET_BANKING_GRAS",
  "bankReference": "MAHB000124981",
  "receiptFileUrl": "https://storage.docflow.gov.in/uploads/challans/gras_receipt_78412.pdf"
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment receipt attached. Treasury auto-verification initiated.",
  "data": {
    "applicationId": "APP-MH-2026-89412",
    "challanNumber": "MH-GRAS-2026-78412",
    "treasuryStatus": "VERIFICATION_PENDING"
  }
}
```

---

## 6. Withdraw Clearance Application
- **Endpoint**: `/api/applications/:id/withdraw`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "reason": "Machinery specifications altered; submitting a revised composite clearance docket."
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Application withdrawn successfully. Tracking closed.",
  "data": {
    "applicationId": "APP-MH-2026-89412",
    "status": "WITHDRAWN",
    "withdrawnAt": "2026-09-12T01:30:00.000Z"
  }
}
```
