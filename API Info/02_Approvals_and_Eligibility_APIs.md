# 02. Approvals, "Know Your Approval" & Rules Engine APIs

Empowers industrial applicants to discover mandatory statutory clearances, calculate precise fee structures, determine compliance timelines, and retrieve required document checklists before applying.

---

## 1. Evaluate "Know Your Approval" Questionnaire
Evaluates enterprise parameters against statutory regulatory rules (Pollution Control, Factory Safety, Municipal, Utility, Fire) to generate a customized list of mandatory and optional approvals.

- **Endpoint**: `/api/approvals/evaluate`
- **Method**: `POST`
- **Access**: Public / Authenticated
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "sector": "Chemical & Allied Products",
  "subSector": "Specialty Solvents & Resin Formulations",
  "enterpriseScale": "MEDIUM",
  "state": "Maharashtra",
  "district": "Raigad",
  "zoneType": "MIDC_NOTIFIED_INDUSTRIAL_AREA",
  "plotAreaSqM": 4500,
  "builtUpAreaSqM": 2800,
  "connectedPowerLoadKW": 120,
  "dailyWaterConsumptionKLD": 35,
  "generatesHazardousWaste": true,
  "involvesBoilerInstallation": true,
  "boilerCapacityTph": 2.5,
  "involvesChemicalStorage": true,
  "chemicalTonnage": 45,
  "totalCapitalInvestmentInr": 35000000,
  "expectedWorkforceCount": 65
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Approval assessment generated successfully",
  "data": {
    "totalApprovalsRequired": 4,
    "totalEstimatedDays": 45,
    "totalEstimatedFeeInr": 87500,
    "mandatoryApprovals": [
      {
        "approvalId": "APP-ENV-001",
        "code": "CTE-ORANGE",
        "title": "Consent to Establish (CTE) - Orange Category",
        "authority": "Maharashtra Pollution Control Board (MPCB)",
        "category": "ENVIRONMENT",
        "statutoryAct": "Water (Prevention and Control of Pollution) Act, 1974 & Air Act, 1981",
        "maxSlaDays": 30,
        "estimatedFeeInr": 45000,
        "validityYears": 5,
        "urgency": "MANDATORY_PRE_CONSTRUCTION",
        "reason": "Triggered by solvent formulations and water consumption > 20 KLD."
      },
      {
        "approvalId": "APP-SFT-002",
        "code": "DISH-FAC-LIC",
        "title": "Factory Plan Approval & Provisional Safety License",
        "authority": "Directorate of Industrial Safety & Health (DISH)",
        "category": "SAFETY",
        "statutoryAct": "The Factories Act, 1948 - Section 6",
        "maxSlaDays": 21,
        "estimatedFeeInr": 18000,
        "validityYears": 1,
        "urgency": "MANDATORY_PRE_CONSTRUCTION",
        "reason": "Triggered by workforce > 20 with power utilization > 50 KW."
      },
      {
        "approvalId": "APP-BOI-003",
        "code": "BOILER-REG",
        "title": "Steam Boiler Inspection & Registration Certificate",
        "authority": "Directorate of Steam Boilers, Maharashtra",
        "category": "SAFETY",
        "statutoryAct": "The Boilers Act, 1923",
        "maxSlaDays": 15,
        "estimatedFeeInr": 12500,
        "validityYears": 1,
        "urgency": "MANDATORY_PRE_COMMISSIONING",
        "reason": "Triggered by installed 2.5 TPH steam boiler."
      },
      {
        "approvalId": "APP-FIR-004",
        "code": "FIRE-NOC-PROV",
        "title": "Provisional Fire Safety NOC",
        "authority": "MIDC Fire & Emergency Services",
        "category": "SAFETY",
        "statutoryAct": "Maharashtra Fire Prevention and Life Safety Measures Act, 2006",
        "maxSlaDays": 20,
        "estimatedFeeInr": 12000,
        "validityYears": 1,
        "urgency": "MANDATORY_PRE_CONSTRUCTION",
        "reason": "Triggered by hazardous chemical storage > 20 MT."
      }
    ],
    "optionalApprovals": [
      {
        "approvalId": "APP-UTL-005",
        "code": "DG-SET-PERMIT",
        "title": "Diesel Generator Set Electrical Inspectorate Approval",
        "authority": "Chief Electrical Inspectorate",
        "category": "UTILITY",
        "maxSlaDays": 10,
        "estimatedFeeInr": 4500,
        "reason": "Recommended if installing standby power backup generator > 125 kVA."
      }
    ]
  }
}
```

---

## 2. Get Approvals Catalog
Retrieves the complete statutory directory of clearances across government departments.

- **Endpoint**: `/api/approvals`
- **Method**: `GET`
- **Access**: Public
- **Headers**: None required

### Request Query Parameters
| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `category` | String | No | Filter by category | `ENVIRONMENT`, `SAFETY`, `UTILITY`, `MUNICIPAL` |
| `authority`| String | No | Filter by issuing board | `MPCB`, `DISH`, `MIDC` |
| `search` | String | No | Keyword search in title/desc | `Fire NOC` |
| `page` | Integer | No | Page number (default: 1) | `1` |
| `limit` | Integer | No | Records per page (default: 20)| `10` |

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Approvals catalog fetched successfully",
  "data": [
    {
      "id": "APP-ENV-001",
      "code": "CTE-ORANGE",
      "title": "Consent to Establish (CTE) - Orange Category",
      "department": "Maharashtra Pollution Control Board (MPCB)",
      "category": "ENVIRONMENT",
      "maxSlaDays": 30,
      "baseFeeInr": 45000,
      "validityYears": 5,
      "isOnlineApplication": true,
      "description": "Industrial statutory environmental permit for civil layout and machinery commissioning."
    }
  ],
  "pagination": {
    "total": 48,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## 3. Get Single Approval Detail
- **Endpoint**: `/api/approvals/:id`
- **Method**: `GET`
- **Access**: Public
- **Headers**: None required

### Route Parameters
- `id`: Unique approval identifier (e.g., `APP-ENV-001`)

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Approval details fetched successfully",
  "data": {
    "id": "APP-ENV-001",
    "code": "CTE-ORANGE",
    "title": "Consent to Establish (CTE) - Orange Category",
    "department": "Maharashtra Pollution Control Board (MPCB)",
    "category": "ENVIRONMENT",
    "maxSlaDays": 30,
    "validityYears": 5,
    "description": "Statutory environmental permit required under Section 25 of Water Act and Section 21 of Air Act.",
    "feeCalculationFormula": "baseFee + (capitalInvestment * 0.001)",
    "requiredDocuments": [
      {
        "docCode": "SITE_PLAN",
        "name": "Industrial Site Layout & Plant Master Plan",
        "format": "PDF",
        "maxSizeMB": 10,
        "isMandatory": true
      },
      {
        "docCode": "EIA_REPORT",
        "name": "Environmental Management & Effluent Treatment Plan",
        "format": "PDF",
        "maxSizeMB": 15,
        "isMandatory": true
      },
      {
        "docCode": "LAND_POSSESSION",
        "name": "MIDC Land Allotment Letter / 7-12 Land Extract",
        "format": "PDF",
        "maxSizeMB": 5,
        "isMandatory": true
      }
    ],
    "pipelineStages": [
      { "order": 1, "title": "Desk Screening & Document Verification", "maxDays": 5 },
      { "order": 2, "title": "Field Officer Site Inspection", "maxDays": 12 },
      { "order": 3, "title": "Legal & GRAS Challan Verification", "maxDays": 5 },
      { "order": 4, "title": "Apex Digital Certificate Issuance", "maxDays": 8 }
    ]
  }
}
```

---

## 4. Dynamic Fee & Timeline Calculator
Calculates aggregated statutory fees, government treasury head splits, and cumulative SLA days for selected clearances.

- **Endpoint**: `/api/approvals/calculator`
- **Method**: `POST`
- **Access**: Public / Authenticated
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "approvalIds": ["APP-ENV-001", "APP-SFT-002", "APP-FIR-004"],
  "enterpriseScale": "MEDIUM",
  "totalInvestmentInr": 35000000
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Fee and timeline calculation computed",
  "data": {
    "totalFeeInr": 75000,
    "cumulativeSlaDays": 30,
    "fastTrackEligible": true,
    "fastTrackDays": 18,
    "feeBreakdown": [
      {
        "approvalId": "APP-ENV-001",
        "title": "Consent to Establish (CTE)",
        "baseFee": 25000,
        "capitalLevy": 20000,
        "subTotal": 45000,
        "treasuryHead": "0070-60-800-01-MPCB"
      },
      {
        "approvalId": "APP-SFT-002",
        "title": "Factory Plan Approval",
        "baseFee": 10000,
        "capitalLevy": 8000,
        "subTotal": 18000,
        "treasuryHead": "0230-00-101-01-DISH"
      },
      {
        "approvalId": "APP-FIR-004",
        "title": "Provisional Fire Safety NOC",
        "baseFee": 12000,
        "capitalLevy": 0,
        "subTotal": 12000,
        "treasuryHead": "0070-60-109-02-FIRE"
      }
    ]
  }
}
```

---

## 5. Consolidated Supporting Checklist
Compiles all distinct documents required across multiple clearances, de-duplicating common submissions (e.g. Land Title, Site Plan).

- **Endpoint**: `/api/approvals/required-documents`
- **Method**: `POST`
- **Access**: Public / Authenticated
- **Headers**: `Content-Type: application/json`

### Request Body JSON Format
```json
{
  "approvalIds": ["APP-ENV-001", "APP-SFT-002", "APP-FIR-004"]
}
```

### Success Response JSON Format (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Consolidated document checklist compiled",
  "data": {
    "totalRequired": 4,
    "documents": [
      {
        "docCode": "SITE_PLAN",
        "name": "Industrial Site Layout & Architectural Blueprint",
        "sharedAcross": ["APP-ENV-001", "APP-SFT-002", "APP-FIR-004"],
        "maxSizeMB": 10
      },
      {
        "docCode": "LAND_POSSESSION",
        "name": "MIDC Land Allotment Letter / 7-12 Extract",
        "sharedAcross": ["APP-ENV-001", "APP-SFT-002"],
        "maxSizeMB": 5
      },
      {
        "docCode": "EIA_REPORT",
        "name": "Effluent Management & Treatment Plan",
        "sharedAcross": ["APP-ENV-001"],
        "maxSizeMB": 15
      },
      {
        "docCode": "FIRE_HYDRANT_LAYOUT",
        "name": "Fire Fighting Hydrant & Emergency Evacuation Plan",
        "sharedAcross": ["APP-FIR-004"],
        "maxSizeMB": 8
      }
    ]
  }
}
```
