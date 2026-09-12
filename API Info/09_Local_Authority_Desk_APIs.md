# 09. Local Authority Desk & Field Inspection APIs

Powers the Local Authority portal (`/local-auth/requests`, `/local-auth/history`, `/local-auth/complaints`, `/local-auth/profile`) for scrutiny officers, nodal engineers, and field inspection directorates.

---

## 1. Get Inward Clearance Requests Queue
- **Endpoint**: `/api/local-auth/requests`
- **Method**: `GET`
- **Access**: Authenticated (`LOCAL_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `stage` | String | No | Filter desk queue | `DESK_SCRUTINY`, `FIELD_INSPECTION`, `ALL` |
| `priority` | String | No | Priority urgency | `CRITICAL`, `HIGH`, `MEDIUM` |
| `search` | String | No | Enterprise or Application ID | `Sharma Polymers` |
| `page` | Integer | No | Page number | `1` |
| `limit` | Integer | No | Records per page | `10` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Inward queue fetched successfully",
  "data": [
    {
      "requestId": "APP-MH-2026-89412",
      "enterpriseName": "Sharma Precision Polymers Pvt Ltd",
      "udyamNumber": "UDYAM-MH-12-0045612",
      "approvalTitle": "Consent to Establish (CTE) - Orange Category",
      "stage": "DESK_SCRUTINY",
      "priority": "HIGH",
      "dateReceived": "2026-08-12",
      "daysInCurrentDesk": 4,
      "slaDeadline": "2026-08-20",
      "isSlaCritical": false,
      "plotDetails": "Plot A-44/2, Taloja MIDC, Raigad",
      "attachedDocsCount": 3
    },
    {
      "requestId": "APP-MH-2026-89413",
      "enterpriseName": "Maharashtra Apex Biofuels Ltd",
      "udyamNumber": "UDYAM-MH-12-0099812",
      "approvalTitle": "Water Supply Connection Sanction",
      "stage": "FIELD_INSPECTION",
      "priority": "CRITICAL",
      "dateReceived": "2026-08-15",
      "daysInCurrentDesk": 7,
      "slaDeadline": "2026-08-22",
      "isSlaCritical": true,
      "plotDetails": "Plot C-12, Taloja MIDC",
      "attachedDocsCount": 4
    }
  ],
  "pagination": {
    "total": 14,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

## 2. Get Inward Request Dossier for Review
- **Endpoint**: `/api/local-auth/requests/:id`
- **Method**: `GET`
- **Access**: Authenticated (`LOCAL_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Application dossier fetched",
  "data": {
    "requestId": "APP-MH-2026-89412",
    "approvalTitle": "Consent to Establish (CTE) - Orange Category",
    "enterprise": {
      "companyName": "Sharma Precision Polymers Pvt Ltd",
      "applicantName": "Rajesh Kumar Sharma",
      "phone": "+919876543210",
      "email": "rajesh@sharmaenterprises.in",
      "plotNumber": "Plot A-44/2, Taloja MIDC",
      "connectedLoadKW": 95,
      "waterConsumptionKLD": 22
    },
    "documents": [
      {
        "docCode": "SITE_PLAN",
        "docName": "Industrial Site Layout",
        "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/site_plan_001.pdf",
        "verificationStatus": "PENDING"
      },
      {
        "docCode": "EIA_REPORT",
        "docName": "Effluent Treatment Plant (ETP) Specification",
        "fileUrl": "https://storage.docflow.gov.in/uploads/dockets/eia_001.pdf",
        "verificationStatus": "PENDING"
      }
    ],
    "previousStageRemarks": "Applicant docket verified by system algorithms."
  }
}
```

---

## 3. Submit Desk Scrutiny Decision
The scrutiny officer reviews the attachments and either:
1. **Passes/Approves** the docket to proceed to site inspection.
2. **Raises a Discrepancy** sending it back to the applicant for rectification.
3. **Rejects** the application with statutory grounds.

- **Endpoint**: `/api/local-auth/requests/:id/scrutiny`
- **Method**: `POST`
- **Access**: Authenticated (`LOCAL_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format (Raising Discrepancy)
```json
{
  "action": "DISCREPANCY",
  "remarks": "Clarification needed on waste storage capacity and effluent recycling specs.",
  "discrepancyItems": [
    {
      "docCode": "EIA_REPORT",
      "issueDescription": "ETP hydraulic retention time calculation missing in section 4.2."
    }
  ],
  "applicantCorrectionDeadlineDays": 7
}
```

### Request Body JSON Format (Approving Desk Scrutiny)
```json
{
  "action": "APPROVED",
  "remarks": "All land title deeds and environmental treatment schematics verified in accordance with DISH & MPCB guidelines.",
  "forwardToStage": "FIELD_INSPECTION"
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Scrutiny decision recorded and pipeline updated",
  "data": {
    "requestId": "APP-MH-2026-89412",
    "newStatus": "REQUIRES_REVISION",
    "notifiedApplicant": true,
    "timestamp": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 4. Schedule Field Site Inspection
- **Endpoint**: `/api/local-auth/requests/:id/schedule-inspection`
- **Method**: `POST`
- **Access**: Authenticated (`LOCAL_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "inspectionDate": "2026-09-15",
  "inspectionTimeSlot": "11:30 AM - 01:30 PM",
  "inspectorName": "Anand Patil (Divisional Inspector)",
  "inspectorPhone": "+91 22 2757 4410",
  "inspectorEmail": "anand.patil@mpcb.gov.in",
  "designatedOffice": "Regional Industrial Safety Cell, Turbhe, Navi Mumbai",
  "specialInstructions": "Ensure factory key-person and ETP plant civil engineer are present on-site with electrical layout prints."
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Site inspection scheduled. SMS & email alert dispatched to enterprise.",
  "data": {
    "inspectionScheduleId": "INSP-SCH-2026-0915",
    "requestId": "APP-MH-2026-89412",
    "inspectionDate": "2026-09-15",
    "inspectorName": "Anand Patil"
  }
}
```

---

## 5. Submit Field Inspection Report & Compliance Score
- **Endpoint**: `/api/local-auth/requests/:id/inspection-report`
- **Method**: `POST`
- **Access**: Authenticated (`LOCAL_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "inspectionDate": "2026-09-15",
  "isPassed": true,
  "complianceScore": 92,
  "siteObservations": "Chimney stack height conforms to CPCB standards. ETP civil groundwork 80% constructed as per approved drawing.",
  "checklistOutcomes": [
    { "checkpoint": "Boundary setback distances", "status": "VERIFIED" },
    { "checkpoint": "Effluent collection tank containment", "status": "VERIFIED" },
    { "checkpoint": "Hazardous storage isolation", "status": "SATISFACTORY" }
  ],
  "geoTagging": {
    "latitude": 19.0524,
    "longitude": 73.0941,
    "timestamp": "2026-09-15T12:15:30.000Z"
  },
  "reportDocumentUrl": "https://storage.docflow.gov.in/uploads/reports/inspection_report_89412.pdf",
  "recommendation": "FORWARD_TO_LEGAL_FEE_DESK"
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Inspection report filed and cryptographically signed. Application forwarded to Next Authority Node.",
  "data": {
    "requestId": "APP-MH-2026-89412",
    "nextStage": "AUTH_3_LEGAL_FEE_VERIFICATION",
    "status": "INSPECTION_PASSED"
  }
}
```

---

## 6. Get Authority Request History
- **Endpoint**: `/api/local-auth/history`
- **Method**: `GET`
- **Access**: Authenticated (`LOCAL_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `dateFrom` | String | No | Start date (`YYYY-MM-DD`) | `2026-08-01` |
| `dateTo` | String | No | End date (`YYYY-MM-DD`) | `2026-08-31` |
| `outcome` | String | No | Clearance outcome | `APPROVED`, `REJECTED`, `FORWARDED` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Desk history retrieved",
  "data": [
    {
      "requestId": "APP-MH-2026-89100",
      "enterpriseName": "Godavari Petrochem Ltd",
      "approvalTitle": "Consent to Establish (CTE)",
      "actionTaken": "INSPECTION_PASSED_FORWARDED",
      "completedAt": "2026-08-18",
      "officerName": "Anand Patil"
    }
  ]
}
```

---

## 7. Resolve Local Complaint
- **Endpoint**: `/api/local-auth/complaints/:id/resolve`
- **Method**: `POST`
- **Access**: Authenticated (`LOCAL_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "resolutionNotes": "Field officer re-assigned and inspection completed on 2026-09-15. Discrepancy closed.",
  "status": "RESOLVED"
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Complaint marked as resolved"
}
```
