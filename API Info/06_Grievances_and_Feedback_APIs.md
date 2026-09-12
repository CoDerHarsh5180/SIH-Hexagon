# 06. Grievances, Queries & Citizen Feedback APIs

Manages the grievance redressal mechanism across the platform:
- **Queries** (`/user/query`): Technical or procedural queries routed to department helpdesks.
- **Complaints** (`/user/complain`): Vigilance complaints regarding procedural harassment, delay, misconduct, or corruption.
- **Feedback** (`/user/feedback`): Citizen satisfaction ratings and portal usability feedback.

---

## 1. Submit Helpdesk Query
- **Endpoint**: `/api/grievances/queries`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "subject": "Clarification regarding stack height calculation for DG set exhaust",
  "category": "APPROVAL_PROCEDURE",
  "priority": "HIGH",
  "description": "We are installing a 250 kVA acoustic generator. Please clarify if the chimney formula H = h + 0.2*sqrt(kVA) applies for industrial estate zones.",
  "relatedApplicationId": "APP-MH-2026-89412"
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Query ticket generated and dispatched to Technical Officer Desk",
  "data": {
    "queryTicketId": "QRY-2026-1029",
    "subject": "Clarification regarding stack height calculation for DG set exhaust",
    "status": "OPEN",
    "slaResponseHours": 24,
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 2. Get User Queries List
- **Endpoint**: `/api/grievances/queries`
- **Method**: `GET`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Queries fetched successfully",
  "data": [
    {
      "queryTicketId": "QRY-2026-1029",
      "subject": "Clarification regarding stack height calculation for DG set exhaust",
      "category": "APPROVAL_PROCEDURE",
      "priority": "HIGH",
      "status": "RESOLVED",
      "submittedDate": "2026-09-10",
      "response": "Yes, as per CPCB norms, the statutory formula applies uniformly across MIDC estates.",
      "answeredBy": "Technical Officer, Environmental Directorate"
    }
  ]
}
```

---

## 3. Lodge Formal Administrative / Misconduct Complaint
- **Endpoint**: `/api/grievances/complaints`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "targetDepartment": "Maharashtra Pollution Control Board (MPCB)",
  "subDivision": "Raigad Sub-Regional Office II",
  "complaintCategory": "UNDUE_DELAY",
  "relatedApplicationId": "APP-MH-2026-89412",
  "incidentDate": "2026-09-08",
  "subject": "Unreasonable delay beyond 45 days in conducting scheduled site inspection",
  "description": "The application cleared desk scrutiny on 2026-08-18. Despite repeated portal follow-ups, no inspection officer has been deputed, violating Citizen Charter SLA.",
  "evidenceFiles": [
    {
      "fileName": "Followup_Email_Proof.pdf",
      "fileUrl": "https://storage.docflow.gov.in/uploads/evidence/proof_001.pdf"
    }
  ],
  "isConfidentialWhistleblower": false
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Formal complaint registered and notified to State Vigilance Cell",
  "data": {
    "complaintId": "CMP-MH-2026-0412",
    "trackingToken": "VIG-9981-42",
    "status": "UNDER_INVESTIGATION",
    "assignedInquiryOfficer": "Chief Vigilance Officer, Industries Energy & Labour Dept",
    "statutoryResolutionDays": 15,
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```

---

## 4. Get User Complaints
- **Endpoint**: `/api/grievances/complaints`
- **Method**: `GET`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Complaints retrieved",
  "data": [
    {
      "complaintId": "CMP-MH-2026-0412",
      "targetDepartment": "MPCB",
      "category": "UNDUE_DELAY",
      "subject": "Unreasonable delay in site inspection",
      "status": "UNDER_INVESTIGATION",
      "dateFiled": "2026-09-12",
      "resolutionNotes": null
    }
  ]
}
```

---

## 5. Submit Portal & Clearance Feedback
- **Endpoint**: `/api/grievances/feedback`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "overallRating": 5,
  "categoryRatings": {
    "portalUsability": 5,
    "speedOfProcessing": 4,
    "clarityOfChecklists": 5,
    "officerProfessionalism": 4
  },
  "feedbackComments": "The single-window tracker with contact information of officers drastically reduces visits to government offices.",
  "featureSuggestions": "Add SMS notification when the inspector starts travel to the factory site."
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Thank you for your feedback. Citizen feedback drives platform governance."
}
```

---

## 6. Get Public Feedback Statistics
- **Endpoint**: `/api/grievances/feedback/stats`
- **Method**: `GET`
- **Access**: Public
- **Headers**: None required

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Public feedback metrics fetched",
  "data": {
    "totalReviews": 3420,
    "averageSatisfactionScore": 4.6,
    "ratingBreakdown": {
      "fiveStar": 2340,
      "fourStar": 810,
      "threeStar": 190,
      "twoStar": 50,
      "oneStar": 30
    },
    "satisfactionPercentage": 92.1
  }
}
```
