# 05. Document Vault & Statutory Renewals APIs

Powers the Enterprise Compliance Vault (`/user/your-docs`), the Pending Clearances view (`/user/pending-docs`), and the 2-step renewal wizard with mandatory document checklist verification, tenure selection, and fee payment.

---

## 1. Get Enterprise Vault Documents ("Your Docs")
- **Endpoint**: `/api/vault/documents`
- **Method**: `GET`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `status` | String | No | Filter by certificate validity | `ACTIVE`, `EXPIRING_SOON`, `EXPIRED`, `ALL` |
| `category` | String | No | Filter by category | `ENVIRONMENT`, `SAFETY`, `UTILITY` |
| `search` | String | No | Filter by license name | `Consent to Operate` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Vault documents fetched successfully",
  "data": [
    {
      "id": "doc-vlt-001",
      "name": "Consent to Operate (CTO) - Air & Water",
      "authority": "Maharashtra Pollution Control Board (MPCB)",
      "category": "ENVIRONMENT",
      "certificateNumber": "MPCB/RO-NM/CTO/2109000124",
      "issueDate": "2021-10-15",
      "expiryDate": "2026-10-14",
      "status": "ACTIVE",
      "daysToExpiry": 32,
      "isRenewable": true,
      "renewalFeeInr": 18500,
      "fileUrl": "https://storage.docflow.gov.in/vault/cert_cto_001.pdf"
    },
    {
      "id": "doc-vlt-002",
      "name": "Factory License (Form 4)",
      "authority": "Directorate of Industrial Safety & Health (DISH)",
      "category": "SAFETY",
      "certificateNumber": "DISH/THN/FAC/54129",
      "issueDate": "2025-01-01",
      "expiryDate": "2025-12-31",
      "status": "EXPIRED",
      "daysToExpiry": -255,
      "isRenewable": true,
      "renewalFeeInr": 8200,
      "fileUrl": "https://storage.docflow.gov.in/vault/cert_dish_002.pdf"
    }
  ]
}
```

---

## 2. Get Pending Documents ("Pending Docs")
Fetches clearances and renewals requiring urgent applicant action (discrepancy responses, pending renewals, incomplete submissions).

- **Endpoint**: `/api/vault/pending-docs`
- **Method**: `GET`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `priority` | String | No | Filter priority level | `CRITICAL`, `HIGH`, `MEDIUM`, `ALL` |
| `search` | String | No | Search query | `Safety NOC` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pending documents fetched successfully",
  "data": [
    {
      "id": "pend-001",
      "applicationId": "APP-MH-2026-89411",
      "name": "Final Factory Safety NOC",
      "authority": "Directorate of Industrial Safety & Health (DISH)",
      "type": "Safety Clearance",
      "stage": "Awaiting User Submission",
      "dueDate": "2026-09-30",
      "status": "NOT_SUBMITTED",
      "reason": "Mandatory before machine energization and electrical inspectorate signoff.",
      "priority": "HIGH",
      "actionRoute": "/user/track/APP-MH-2026-89411"
    },
    {
      "id": "pend-002",
      "applicationId": "APP-MH-2026-89412",
      "name": "Hazardous Waste Authorization (Form 1)",
      "authority": "Maharashtra Pollution Control Board (MPCB)",
      "type": "Environmental Clearance",
      "stage": "Desk Screening Discrepancy",
      "dueDate": "2026-09-22",
      "status": "REQUIRES_REVISION",
      "reason": "Clarification needed on waste storage capacity & effluent recycling specs.",
      "priority": "CRITICAL",
      "actionRoute": "/user/track/APP-MH-2026-89412"
    }
  ]
}
```

---

## 3. Get Single Vault Document Detail & Renewal Requirements
- **Endpoint**: `/api/vault/documents/:id`
- **Method**: `GET`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Document renewal specifications retrieved",
  "data": {
    "id": "doc-vlt-001",
    "name": "Consent to Operate (CTO) - Air & Water",
    "authority": "Maharashtra Pollution Control Board (MPCB)",
    "certificateNumber": "MPCB/RO-NM/CTO/2109000124",
    "status": "ACTIVE",
    "expiryDate": "2026-10-14",
    "renewalTenures": [
      { "years": 1, "feeInr": 18500 },
      { "years": 3, "feeInr": 50000 },
      { "years": 5, "feeInr": 78000 }
    ],
    "requiredRenewalDocs": [
      {
        "docCode": "ENVIRONMENTAL_AUDIT_REPORT",
        "name": "Annual Environmental Statement / Audit (Form V)",
        "isMandatory": true,
        "description": "Latest financial year environmental audit approved by accredited lab."
      },
      {
        "docCode": "EFFLUENT_TEST_REPORT",
        "name": "Quarterly Effluent & Chimney Emission Analysis Report",
        "isMandatory": true,
        "description": "Lab test parameters certified within the last 90 days."
      },
      {
        "docCode": "HAZ_WASTE_RETURN",
        "name": "Annual Hazardous Waste Manifest Return (Form 4)",
        "isMandatory": false,
        "description": "Required only if total hazardous sludge generation > 5 MT/year."
      }
    ]
  }
}
```

---

## 4. Upload Certificate to Vault
Allows manual upload of statutory documents or legacy certificates.

- **Endpoint**: `/api/vault/documents/upload`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: multipart/form-data`

### Form Data Fields
| Field Name | Type | Required | Description |
|---|---|---|---|
| `certificateName` | String | Yes | Name of document/license |
| `issuingAuthority`| String | Yes | Issuing department |
| `certificateNumber`| String | Yes | Statutory registration ID |
| `issueDate` | String | Yes | Date of issue (`YYYY-MM-DD`) |
| `expiryDate` | String | Yes | Expiration date (`YYYY-MM-DD`) |
| `documentFile` | File (PDF) | Yes | Uploaded binary file |

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Certificate indexed and saved to enterprise vault",
  "data": {
    "id": "doc-vlt-009",
    "name": "Fire Safety NOC Renewal Certificate",
    "fileUrl": "https://storage.docflow.gov.in/vault/cert_fire_009.pdf",
    "status": "ACTIVE"
  }
}
```

---

## 5. Renew Document (2-Step Renewal Submission)
- **Endpoint**: `/api/vault/documents/:id/renew`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "renewalTenureYears": 3,
  "uploadedRenewalDocs": [
    {
      "docCode": "ENVIRONMENTAL_AUDIT_REPORT",
      "fileName": "Form_V_Audit_2025_26.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/renewals/env_audit_2026.pdf"
    },
    {
      "docCode": "EFFLUENT_TEST_REPORT",
      "fileName": "ETP_Lab_Report_Aug_2026.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/renewals/etp_report.pdf"
    }
  ],
  "payment": {
    "totalAmountInr": 50000,
    "paymentMethod": "UPI_GATEWAY",
    "transactionReference": "UPI/20260912/894129841",
    "paymentStatus": "SUCCESS"
  }
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Renewal application filed successfully. Auto-routed to department desk.",
  "data": {
    "renewalApplicationId": "RNW-MH-2026-4410",
    "documentId": "doc-vlt-001",
    "renewalTenureYears": 3,
    "newEstimatedExpiryDate": "2029-10-14",
    "status": "RENEWAL_PROCESSING",
    "trackingUrl": "/user/track/RNW-MH-2026-4410"
  }
}
```

---

## 6. Download Digitally Signed Certificate
- **Endpoint**: `/api/vault/documents/:id/download`
- **Method**: `GET`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Response**: Binary stream (`application/pdf`) with QR-coded cryptographically verifiable token.
