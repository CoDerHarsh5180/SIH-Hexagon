# 10. Main Authority Governance & Apex Regulatory APIs

Powers the Main Authority Directorate portal (`/main-auth/dashboard`, `/main-auth/catalog`, `/main-auth/create-doc`, `/main-auth/local-auths`, `/main-auth/complaints`, `/main-auth/profile`) for state administrators, department secretaries, and apex regulatory heads.

---

## 1. Get Apex Dashboard Macro Analytics
Provides high-level statutory clearance KPIs, SLA compliance rates, average processing times, and automated bottleneck node detection.

- **Endpoint**: `/api/main-auth/analytics`
- **Method**: `GET`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Apex analytics metrics fetched",
  "data": {
    "totalApplicationsReceived": 14280,
    "clearancesIssued": 11840,
    "inProgressApplications": 1950,
    "rejectedApplications": 490,
    "overallSlaCompliancePercent": 93.4,
    "averageTurnaroundDays": 19.2,
    "totalStatutoryFeesCollectedInr": 482050000,
    "bottleneckStage": {
      "stageName": "Auth 2: Field Site Inspection",
      "averageDelayDays": 5.4,
      "delayedApplicationsCount": 182,
      "primaryReason": "Inspector-to-application deficit in Konkan & Pune Industrial Clusters"
    },
    "regionalPerformance": [
      { "division": "Mumbai Metropolitan (MMR)", "complianceRate": 96.2, "activeFiles": 540 },
      { "division": "Pune Division", "complianceRate": 91.8, "activeFiles": 480 },
      { "division": "Nashik Division", "complianceRate": 94.5, "activeFiles": 290 },
      { "division": "Nagpur Division", "complianceRate": 89.1, "activeFiles": 310 }
    ]
  }
}
```

---

## 2. Get Master Document Catalog
- **Endpoint**: `/api/main-auth/catalog`
- **Method**: `GET`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `department` | String | No | Filter by ministry/board | `MPCB`, `DISH` |
| `category` | String | No | Category | `ENVIRONMENT`, `SAFETY` |
| `page` | Integer | No | Page number | `1` |
| `limit` | Integer | No | Records per page | `15` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Master statutory catalog retrieved",
  "data": [
    {
      "docId": "MAST-ENV-001",
      "docName": "Consent to Establish (CTE) - Orange Category",
      "department": "Maharashtra Pollution Control Board (MPCB)",
      "category": "ENVIRONMENT",
      "validityYears": 5,
      "totalEstimatedDays": 30,
      "pipelineNodeCount": 5,
      "activeApplications": 420,
      "isPublished": true
    }
  ],
  "pagination": {
    "total": 52,
    "page": 1,
    "limit": 15,
    "totalPages": 4
  }
}
```

---

## 3. Create Master Document Approval with Dynamic Pipeline
Enables apex administrators to define a brand-new clearance, specify legal acts, configure multi-node inter-authority pipelines, set SLA time-limits per node, attach fee calculation formulas, and define mandatory upload checklists.

- **Endpoint**: `/api/main-auth/create-doc`
- **Method**: `POST`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "docName": "High-Pressure Gas Cylinder Storage & Distribution License",
  "department": "Petroleum and Explosives Safety Organization (PESO) & State Directorate",
  "statutoryAct": "The Explosives Act, 1884 & Gas Cylinders Rules, 2016",
  "category": "SAFETY",
  "validityYears": 3,
  "totalEstimatedDays": 25,
  "feeCalculationFormula": "15000 + (cylinderStorageCapacityKg * 2.5)",
  "requiredDocuments": [
    {
      "docCode": "SITE_SAFETY_DRAWING",
      "name": "Explosives Storage Layout & Isolation Distances Blueprint",
      "format": "PDF",
      "maxSizeMB": 10,
      "isMandatory": true
    },
    {
      "docCode": "FIRE_NOC",
      "name": "Fire & Emergency Services Clearance Certificate",
      "format": "PDF",
      "maxSizeMB": 5,
      "isMandatory": true
    },
    {
      "docCode": "PRESSURE_VESSEL_CERT",
      "name": "Competent Person Hydraulic Test Certificate",
      "format": "PDF",
      "maxSizeMB": 5,
      "isMandatory": true
    }
  ],
  "pipelineStages": [
    {
      "orderIndex": 1,
      "nodeTitle": "Auth 1: Desk Screening & Distance Verification",
      "authorityDivision": "PESO Sub-Circle Office",
      "maxSlaDays": 5,
      "requiresFieldVisit": false,
      "canIssueDiscrepancy": true
    },
    {
      "orderIndex": 2,
      "nodeTitle": "Auth 2: Joint Explosives & Fire Site Inspection",
      "authorityDivision": "District Explosives Safety Inspectorate",
      "maxSlaDays": 12,
      "requiresFieldVisit": true,
      "canIssueDiscrepancy": true
    },
    {
      "orderIndex": 3,
      "nodeTitle": "Auth 3: Treasury GRAS License Fee Verification",
      "authorityDivision": "Treasury Directorate",
      "maxSlaDays": 3,
      "requiresFieldVisit": false,
      "canIssueDiscrepancy": false
    },
    {
      "orderIndex": 4,
      "nodeTitle": "Final: Controller of Explosives Digital Signoff",
      "authorityDivision": "Chief Controller of Explosives HQ",
      "maxSlaDays": 5,
      "requiresFieldVisit": false,
      "canIssueDiscrepancy": false
    }
  ],
  "inspectionChecklist": [
    "Verify explosive distance radius conforms to Schedule VI",
    "Inspect lightning arrestor grounding resistance (< 4 ohms)",
    "Verify water sprinkler and firefighting dry chemical extinguishers"
  ]
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Master statutory clearance published successfully with active multi-node pipeline orchestration",
  "data": {
    "docId": "MAST-SFT-053",
    "docName": "High-Pressure Gas Cylinder Storage & Distribution License",
    "isPublished": true,
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 4. Get Regional Local Authorities Directory
- **Endpoint**: `/api/main-auth/local-authorities`
- **Method**: `GET`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Local authorities directory retrieved",
  "data": [
    {
      "authorityId": "AUTH-LOC-01",
      "divisionName": "MPCB Sub-Regional Office - Raigad II",
      "department": "Maharashtra Pollution Control Board",
      "nodalOfficer": "S. K. Kulkarni (Sub-Regional Officer)",
      "phone": "+91 22 2757 2739",
      "email": "sro-raigad2@mpcb.gov.in",
      "officeAddress": "Room 304, Raigad Bhavan, CBD Belapur, Navi Mumbai",
      "jurisdictionDistricts": ["Raigad - Panvel, Taloja, Khalapur"],
      "activeAssignedApplications": 42,
      "slaComplianceScore": 94.8
    }
  ]
}
```

---

## 5. Register Subordinate Local Authority Office
- **Endpoint**: `/api/main-auth/local-authorities`
- **Method**: `POST`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "divisionName": "Directorate of Industrial Safety & Health (DISH) - Butibori Cell",
  "department": "Directorate of Industrial Safety & Health",
  "nodalOfficerName": "P. M. Jadhav",
  "nodalOfficerEmail": "dish.butibori@maharashtra.gov.in",
  "phone": "+91 7103 262100",
  "officeAddress": "MIDC Administrative Complex, Butibori, Nagpur - 441122",
  "jurisdictionDistricts": ["Nagpur - Hingna, Butibori"],
  "jurisdictionPincodes": ["441108", "441122"]
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Local authority jurisdiction registered and nodal officer credentials generated",
  "data": {
    "authorityId": "AUTH-LOC-028",
    "divisionName": "DISH - Butibori Cell",
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 6. Get State-Wide Administrative & Vigilance Complaints
- **Endpoint**: `/api/main-auth/complaints`
- **Method**: `GET`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `department` | String | No | Department | `MPCB`, `DISH`, `MIDC` |
| `status` | String | No | Status | `UNDER_INVESTIGATION`, `RESOLVED`, `ESCALATED` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "State complaints dossier fetched",
  "data": [
    {
      "complaintId": "CMP-MH-2026-0412",
      "complainantEnterprise": "Sharma Precision Polymers Pvt Ltd",
      "targetDepartment": "MPCB - Raigad II",
      "category": "UNDUE_DELAY",
      "daysPending": 12,
      "severity": "HIGH",
      "subject": "Delay beyond 45 days in conducting site inspection",
      "status": "UNDER_INVESTIGATION"
    }
  ]
}
```

---

## 7. Apex Regulatory Intervention on Complaint
Allows Main Authority heads to override delays, issue disciplinary show-cause notices, or expedite pending clearances.

- **Endpoint**: `/api/main-auth/complaints/:id/intervene`
- **Method**: `POST`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "action": "EXPEDITE_CLEARANCE",
  "reassignedInspectorEmail": "senior.inspector@mpcb.gov.in",
  "mandatedCompletionHours": 48,
  "disciplinaryNotes": "Officer Anand Patil issued warning memo for exceeding statutory Citizen Charter inspection SLA without recording reasons."
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Regulatory order issued. File reassigned with 48-hour completion mandate.",
  "data": {
    "complaintId": "CMP-MH-2026-0412",
    "actionTaken": "EXPEDITE_CLEARANCE",
    "updatedStatus": "DIRECTED_FOR_COMPLIANCE",
    "timestamp": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 8. Get Central Clearance Requests Queue
Retrieves statutory clearance dockets escalated or forwarded from local authority district desks that require Apex State/Central Directorate sanction.

- **Endpoint**: `/api/main-auth/requests`
- **Method**: `GET`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `status` | String | No | Filter queue | `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `ALL` |
| `clearanceLevel` | String | No | Clearance tier | `APEX_STATE_CLEARANCE`, `CENTRAL_STATUTORY_SANCTION` |
| `search` | String | No | Search by enterprise / clearance | `Godavari Petrochem` |
| `page` | Integer | No | Page number (default: 1) | `1` |
| `limit` | Integer | No | Records per page (default: 10) | `10` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Central clearance requests fetched successfully",
  "data": [
    {
      "requestId": "CENTRAL-REQ-2026-901",
      "appliedDate": "2026-09-01",
      "requestedDocName": "State Environmental Impact Clearance (Category B1)",
      "clearanceLevel": "APEX_STATE_CLEARANCE",
      "forwardedBy": "MPCB Sub-Regional Desk Raigad",
      "enterprise": {
        "name": "Godavari Mega Petrochem & Polymers SEZ Ltd",
        "type": "Heavy Petrochemical Refinery & Bulk Storage",
        "ownerName": "Vikramaditya Singhania",
        "mobile": "+91 98110 44290",
        "email": "clearance@godavaripetrochem.in",
        "plotLocation": "Special Investment Region, Dighi Port Industrial Corridor",
        "district": "Raigad",
        "capitalInvestmentInr": "₹ 450 Crores",
        "connectedLoad": "12.5 MVA"
      },
      "status": "PENDING_REVIEW",
      "attachedDocsCount": 4
    }
  ],
  "pagination": {
    "total": 6,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 9. Get Central Clearance Dossier & Inter-Authority Trail
- **Endpoint**: `/api/main-auth/requests/:id`
- **Method**: `GET`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Clearance dossier fetched successfully",
  "data": {
    "requestId": "CENTRAL-REQ-2026-901",
    "requestedDocName": "State Environmental Impact Clearance (Category B1)",
    "clearanceLevel": "APEX_STATE_CLEARANCE",
    "forwardedBy": "MPCB Sub-Regional Desk Raigad",
    "enterprise": {
      "name": "Godavari Mega Petrochem & Polymers SEZ Ltd",
      "ownerName": "Vikramaditya Singhania",
      "email": "clearance@godavaripetrochem.in",
      "capitalInvestmentInr": "₹ 450 Crores"
    },
    "scrutinyHistory": [
      { "stage": "Local Desk Scrutiny", "status": "RECOMMENDED", "officer": "S. K. Kulkarni (Raigad SRO)", "date": "2026-08-20" },
      { "stage": "Field Environmental Inspection", "status": "PASSED", "officer": "Anand Patil (Field Tech Directorate)", "date": "2026-08-28" }
    ],
    "userDocs": [
      { "id": "cd-1", "title": "Comprehensive Environmental Impact Assessment (EIA).pdf", "size": "14.2 MB", "fileUrl": "https://storage.docflow.gov.in/uploads/eia_901.pdf" }
    ]
  }
}
```

---

## 10. Issue Apex Statutory Clearance Sanction
Approves the mega-project clearance, assigns a permanent statutory certificate registration ID, and attaches cryptographically verifiable digital signature tokens.

- **Endpoint**: `/api/main-auth/requests/:id/approve`
- **Method**: `POST`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "signedLicenseNumber": "APEX-MAH-2026-894120",
  "validityYears": 5,
  "concurrenceRemarks": "Granted statutory apex clearance following scrutiny concurrence from local regional directorates and verification of statutory compliance metrics.",
  "isDigitalTokenSigned": true
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Apex statutory clearance issued and tokenized QR certificate generated",
  "data": {
    "requestId": "CENTRAL-REQ-2026-901",
    "signedLicenseNumber": "APEX-MAH-2026-894120",
    "status": "APPROVED",
    "issuedAt": "2026-09-12T01:30:00.000Z",
    "vaultDelivered": true
  }
}
```

---

## 11. Issue Statutory Remittance / Disapproval Order
- **Endpoint**: `/api/main-auth/requests/:id/reject`
- **Method**: `POST`
- **Access**: Authenticated (`MAIN_AUTH`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "primaryGround": "NON_COMPLIANCE_WITH_APEX_STANDARDS",
  "detailedReason": "The submitted environmental management plan does not satisfy zero-liquid-discharge (ZLD) norms for river basin proximity. Remitted back to applicant with statutory non-concurrence.",
  "notifyDistrictDesk": true
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Statutory remittance order served. Applicant and district desk notified.",
  "data": {
    "requestId": "CENTRAL-REQ-2026-901",
    "status": "REJECTED",
    "remittedAt": "2026-09-12T01:30:00.000Z"
  }
}
```

