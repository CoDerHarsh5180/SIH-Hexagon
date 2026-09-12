# DocFlow API Documentation & Backend Specification

Welcome to the backend API specification for the **DocFlow Single-Window Industrial Clearance Platform**.
This directory contains complete specifications for all backend endpoints required across the three portals:
1. **User Portal (Industrial Applicants / MSMEs / Enterprises)**
2. **Local Authority Portal (Scrutiny Officers & Field Inspectors)**
3. **Main Authority Portal (Apex Regulators & Directorate Administrators)**

---

## 1. Directory Structure

| File | Module / Domain | Target Portals |
|---|---|---|
| [`01_Auth_and_Profile_APIs.md`](./01_Auth_and_Profile_APIs.md) | Authentication, JWT Session & Enterprise Profile | All Portals |
| [`02_Approvals_and_Eligibility_APIs.md`](./02_Approvals_and_Eligibility_APIs.md) | "Know Your Approval" Rule Engine, Catalog & Fee Calculator | User Portal / Public |
| [`03_Applications_and_CustomApply_APIs.md`](./03_Applications_and_CustomApply_APIs.md) | Clearance Applications, Custom Apply, Discrepancies & Challans | User Portal |
| [`04_Document_Tracking_and_Pipeline_APIs.md`](./04_Document_Tracking_and_Pipeline_APIs.md) | Multi-Node Inter-Authority Pipeline Tracking & Escalation | User Portal / Public |
| [`05_Vault_and_Renewals_APIs.md`](./05_Vault_and_Renewals_APIs.md) | "Your Docs" Vault, "Pending Docs" & 2-Step Statutory Renewal | User Portal |
| [`06_Grievances_and_Feedback_APIs.md`](./06_Grievances_and_Feedback_APIs.md) | Citizen Queries, Vigilance Complaints & Portal Feedback | User / Local / Main |
| [`07_Gov_Benefits_and_Subsidies_APIs.md`](./07_Gov_Benefits_and_Subsidies_APIs.md) | Capital Subsidies, MSME Incentives & Eligibility Evaluation | User Portal |
| [`08_Notifications_APIs.md`](./08_Notifications_APIs.md) | Push Alerts, SLA Countdown Warnings & Status Changes | All Portals |
| [`09_Local_Authority_Desk_APIs.md`](./09_Local_Authority_Desk_APIs.md) | Inward Desk Scrutiny, Field Site Inspection & History | Local Authority Portal |
| [`10_Main_Authority_Governance_APIs.md`](./10_Main_Authority_Governance_APIs.md) | Apex Analytics, Master Doc Creation & Dynamic Pipelines | Main Authority Portal |

---

## 2. Global Conventions

### 2.1 Base URL
- Local Development: `http://localhost:5000/api`
- Production: `https://api.docflow.gov.in/api`

### 2.2 Standard Request Headers
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```
*Note: For endpoints accepting file uploads (PDFs, drawings, receipts), use `multipart/form-data` without explicitly setting `Content-Type` in the client.*

### 2.3 Standard Success Response Envelope (JSON)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {},
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "totalPages": 12
  }
}
```

### 2.4 Standard Error Response Envelope (JSON)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed on input parameters",
  "errors": [
    {
      "field": "udyamNumber",
      "message": "Invalid Udyam Registration format"
    }
  ]
}
```

### 2.5 Standard HTTP Status Codes
- `200 OK`: Successful retrieval or update
- `201 Created`: Resource successfully created
- `204 No Content`: Successful deletion
- `400 Bad Request`: Input validation failed
- `401 Unauthorized`: Token missing, invalid, or expired
- `403 Forbidden`: User role unauthorized for this resource
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (e.g., email / CIN already registered)
- `422 Unprocessable Entity`: Business logic / clearance rule violation
- `500 Internal Server Error`: Server exception
