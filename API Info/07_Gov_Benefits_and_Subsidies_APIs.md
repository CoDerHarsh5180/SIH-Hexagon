# 07. Government Benefits & Incentive Schemes APIs

Empowers industrial applicants (`/user/gov-benefits`) to explore Central and State financial incentive schemes, calculate eligible capital subsidies, check eligibility criteria against enterprise metrics, and apply directly.

---

## 1. Get Government Incentive Schemes
- **Endpoint**: `/api/benefits/schemes`
- **Method**: `GET`
- **Access**: Public / Authenticated
- **Headers**: None required

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `sector` | String | No | Target industry sector | `Manufacturing`, `Textile`, `Solar` |
| `type` | String | No | Benefit incentive category | `CAPITAL_SUBSIDY`, `INTEREST_SUBVENTION`, `POWER_TARIFF` |
| `search` | String | No | Keyword search | `Green Tech` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Government benefit schemes fetched successfully",
  "data": [
    {
      "id": "SCHM-MAH-001",
      "title": "Package Scheme of Incentives (PSI) - Capital Subsidy",
      "department": "Directorate of Industries, Government of Maharashtra",
      "type": "CAPITAL_SUBSIDY",
      "maxBenefitAmount": "₹ 1,50,00,000",
      "eligibleScales": ["MICRO", "SMALL", "MEDIUM"],
      "eligibleSectors": ["Manufacturing", "Plastic Recycling", "Automotive Components"],
      "deadline": "2027-03-31",
      "description": "Up to 35% capital investment subsidy on plant and machinery deployed in developing industrial zones.",
      "qualifyingCriteria": [
        "Valid Udyam Registration",
        "Located in Zone C, D, or D+ industrial talukas",
        "Commercial production started after April 2024"
      ]
    },
    {
      "id": "SCHM-CEN-002",
      "title": "Credit Linked Capital Subsidy for Technology Upgradation (CLCSS)",
      "department": "Ministry of Micro, Small and Medium Enterprises (MoMSME)",
      "type": "TECHNOLOGY_UPGRADATION",
      "maxBenefitAmount": "₹ 15,00,00",
      "eligibleScales": ["MICRO", "SMALL"],
      "eligibleSectors": ["All Manufacturing"],
      "deadline": "2026-12-31",
      "description": "15% upfront capital subsidy for institutional finance availed for well-established technology induction."
    }
  ]
}
```

---

## 2. Check Scheme Eligibility
Evaluates whether the authenticated user's registered enterprise qualifies for the specified scheme based on turnover, scale, location, and investment.

- **Endpoint**: `/api/benefits/schemes/:id/check-eligibility`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Eligibility evaluation completed",
  "data": {
    "schemeId": "SCHM-MAH-001",
    "isEligible": true,
    "matchScorePercent": 100,
    "potentialSubsidyAmountInr": 12250000,
    "matchedCriteria": [
      { "criterion": "Enterprise Scale", "status": "PASSED", "details": "Registered as MEDIUM enterprise" },
      { "criterion": "Industrial Location", "status": "PASSED", "details": "Taloja MIDC qualifies under Zone D eligible zones" },
      { "criterion": "Sector Match", "status": "PASSED", "details": "Polymer & Plastic manufacturing is a thrust sector" }
    ],
    "unmatchedCriteria": []
  }
}
```

---

## 3. Apply for Incentive / Subsidy Scheme
- **Endpoint**: `/api/benefits/schemes/:id/apply`
- **Method**: `POST`
- **Access**: Authenticated (`USER`)
- **Headers**: `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "schemeId": "SCHM-MAH-001",
  "claimedSubsidyAmountInr": 12250000,
  "financialYear": "2025-2026",
  "bankAccountDetails": {
    "bankName": "State Bank of India",
    "accountNumber": "39201948192",
    "ifscCode": "SBIN0001429",
    "branch": "Taloja Industrial Estate Branch"
  },
  "supportingDocuments": [
    {
      "docTitle": "Audited Balance Sheet & CA Certificate",
      "fileUrl": "https://storage.docflow.gov.in/uploads/benefits/ca_cert.pdf"
    },
    {
      "docTitle": "Plant & Machinery Purchase Invoices",
      "fileUrl": "https://storage.docflow.gov.in/uploads/benefits/invoices.pdf"
    }
  ]
}
```

### Success Response JSON Format (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Subsidy application submitted. Dispatched to Directorate of Industries Subsidies Cell.",
  "data": {
    "claimApplicationId": "CLM-PSI-2026-00412",
    "status": "UNDER_SCRUTINY",
    "estimatedDisbursementDays": 60,
    "createdAt": "2026-09-12T01:30:00.000Z"
  }
}
```
