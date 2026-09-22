<!-- ================================================================================= -->
<!--                               SARAL PROJECT HEADER                                -->
<!-- ================================================================================= -->

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="screenshots/logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="screenshots/logo-light.png">
  <img src="screenshots/logo.png" alt="SARAL Single Window Logo" width="340"/>
</picture>

<br/>

<p align="center">
  <a href="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=2800&pause=1200&color=EA580C&center=true&vCenter=true&width=520&lines=SIH26130%3A+Unified+Industrial+Approvals+Portal;Streamlined+Application%2C+Record%2C+Approval+Link;Single-Window+Compliance+for+Maharashtra;Team+Hexagon+%E2%80%A2+Smart+India+Hackathon+2026">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=16&duration=2800&pause=1200&color=EA580C&center=true&vCenter=true&width=520&lines=SIH26130%3A+Unified+Industrial+Approvals+Portal;Streamlined+Application%2C+Record%2C+Approval+Link;Single-Window+Compliance+for+Maharashtra;Team+Hexagon+%E2%80%A2+Smart+India+Hackathon+2026" alt="SARAL Typing Header" />
  </a>
</p>

<!-- Badges tailored to the actual project colors and details -->
[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-EA580C?style=for-the-badge&logo=target&logoColor=white)](#)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-SIH26130-16A34A?style=for-the-badge&logo=gov.uk&logoColor=white)](#)
[![Team Hexagon](https://img.shields.io/badge/Team%20ID-131088-1E293B?style=for-the-badge&logo=users&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-EA580C?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](#)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](#)
[![Gemini API](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=flat-square&logo=google&logoColor=white)](#)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](#)

</div>

---

<!-- ================================================================================= -->
<!--                               RESOURCE ACTION HUB                                 -->
<!-- ================================================================================= -->

## 🔗 Project Resources & Links

<table align="center" width="100%">
  <tr>
    <td align="center" width="25%">
      <a href="https://your-live-deployment-link.vercel.app">
        <img src="https://img.shields.io/badge/🚀%20Live%20Website-Deployed%20Portal-EA580C?style=for-the-badge&logo=vercel&logoColor=white" width="100%"/>
      </a>
      <br/><b>Live Demonstration</b>
    </td>
    <td align="center" width="25%">
      <a href="https://drive.google.com/drive/folders/YOUR_DRIVE_FOLDER_ID?usp=sharing">
        <img src="https://img.shields.io/badge/📁%20Drive%20Vault-PPT%20%26%20Docs-16A34A?style=for-the-badge&logo=google-drive&logoColor=white" width="100%"/>
      </a>
      <br/><b>SIH PPT, SRS & Flowcharts</b>
    </td>
    <td align="center" width="25%">
      <a href="https://youtu.be/YOUR_DEMO_VIDEO_ID">
        <img src="https://img.shields.io/badge/🎬%20Demo%20Video-Watch%20Walkthrough-DC2626?style=for-the-badge&logo=youtube&logoColor=white" width="100%"/>
      </a>
      <br/><b>Recorded Video Demo</b>
    </td>
    <td align="center" width="25%">
      <a href="https://github.com/CoDerHarsh5180/SIH-Hexagon">
        <img src="https://img.shields.io/badge/💻%20GitHub-Source%20Code-1E293B?style=for-the-badge&logo=github&logoColor=white" width="100%"/>
      </a>
      <br/><b>Repository</b>
    </td>
  </tr>
</table>

---

## 📌 Problem Statement & Context

* **Problem Statement ID**: `SIH26130`
* **Title**: *Efficiency in streamlining industrial approvals, compliance processes, and access to government support services*
* **Theme**: Miscellaneous | **Category**: Software
* **Team**: Hexagon (Team ID: `131088`)
* **Reference Portals**: [MAITRI Maharashtra](https://maitri.maharashtra.gov.in/) • [National Single Window System (NSWS)](https://www.nsws.gov.in/) • [DPIIT](https://eodb.dpiit.gov.in/)

### Real-World Challenge
Entrepreneurs and business founders in India must navigate complex, fragmented clearance procedures across **multiple separate government offices** (Pollution, Labor, Fire, Local Municipalities). Existing portals often act as static directories that redirect applicants back to disparate departmental websites, leading to:
* Repetitive document uploads for each license.
* Unmonitored procedural delays with no automated accountability.
* Lack of coordination between field inspection teams and applicants.
* Missed financial subsidies due to scattered policy information.

### The SARAL Solution
**SARAL (Streamlined Application, Record, Approval Link)** provides a single-window digital platform that coordinates applicants, local district authorities, and apex state administrators. It consolidates document storage, automated application routing, deadline-based auto-escalation, and scheme discovery into one unified system.

---

## 🏗️ Technical Approach & Architecture

The system implementation follows the three-tier operational workflow directly mapped from our architecture:

```mermaid
flowchart TD
    subgraph Stakeholders["Stakeholders"]
        U["🏢 User / Enterprise<br/>(Factory / Applicant)"]
        LA["👮 Local Authority<br/>(Document Issuing & Inspection)"]
        MA["🏛️ Main Authority<br/>(Admin of Authority Type)"]
    end

    subgraph Portals["Web Portals"]
        UP["User Portal"]
        LAP["Local Auth Portal"]
        MAP["Main Auth Portal"]
    end

    U --> UP
    LA --> LAP
    MA --> MAP

    GW["🔌 API Gateway / Express Router"]
    UP --> GW
    LAP --> GW
    MAP --> GW

    subgraph Modules["Implemented Core Modules"]
        AUTH["Auth & User Management"]
        ROUTING["Smart Routing Predictor"]
        SCRUTINY["Scrutiny Workflow"]
        AI["AI Assistant & Query Solver<br/>(Gemini API)"]
        VAULT["Document Vault & App. Engine"]
        SCHEMES["Schemes & Benefits Catalog"]
        INSPECT["Inspection Planner"]
        SLA["SLA & Escalation Tracker"]
        NOTIF["Notification Service<br/>(Nodemailer Email / SMS)"]
    end

    GW --> AUTH
    GW --> ROUTING
    GW --> SCRUTINY
    GW --> AI
    GW --> VAULT
    GW --> SCHEMES
    GW --> INSPECT
    GW --> SLA
    GW --> NOTIF

    subgraph Storage["Storage & Cache"]
        DB[("🍃 MongoDB")]
        REDIS[("⚡ Redis Cache")]
        CLOUD["☁️ Cloudinary File Storage"]
    end

    VAULT --> CLOUD
    AUTH --> DB
    VAULT --> DB
    SCHEMES --> DB
    INSPECT --> DB
    SLA --> DB
    GW -.-> REDIS
```

### System Roles & Responsibilities

1. **User / Enterprise**:
   * Enterprise or factory applicant applying for registrations, clearances, and expansions.
   * Uploads and reuses verified documents in a secure digital account (like DigiLocker).
   * Explores eligible subsidies, calculates incentives, and tracks clearance status.
2. **Local Authority**:
   * District-level officer responsible for reviewing submitted papers and issuing clearances.
   * Schedules on-site inspections and assigns visiting officers.
   * Approves documents with digital verification or requests necessary revisions.
3. **Main Authority**:
   * State-level departmental administrator overseeing overall clearance velocity.
   * Manages approval catalogs, publishes new government schemes and document requirements.
   * Reviews and addresses auto-escalated applications that breached local processing deadlines.

---

## ⚙️ Key Implemented Features

* **Know Your Approvals (KYA)**: An interactive questionnaire where users answer basic queries about their business type, land, and scale to get an exact checklist of required permits.
* **AI Document Intelligence**: Integrated with the **Gemini API** to pre-verify uploaded paperwork, detect missing fields, and flag inconsistencies before formal submission.
* **Doc + App Hub (Enterprise Vault)**: Secure document locker powered by **Cloudinary** and **MongoDB**, allowing users to upload once and reuse verified certificates across subsequent applications.
* **Document Tracking**: Real-time lifecycle visualizer showing current application stage, pending items, and assigned officers.
* **Smart Alerts & Escalation (SLA Monitoring)**:
  * Proactive alerts for upcoming document expiration and renewals.
  * Automated deadline tracking: applications pending beyond statutory timelines are flagged as `Escalated` and routed to the Main Authority.
* **Inspection Planner**: Local authorities schedule inspection dates and notify applicants with officer details.
* **Schemes & Incentive Calculator**: Accessible to public visitors and registered users to calculate eligible capital investment subsidies and stamp duty benefits.

---

## 🖥️ Platform Visual Walkthrough

The interface is presented below following the exact user journey: **Public Discovery (Pre-Auth)** ➔ **Authenticated Applicant Journey** ➔ **Local Authority Operations** ➔ **Main Authority Governance**.

---

### Phase 1: Public Discovery & Transparency (Accessible to Everyone)

#### 1. Landing Page
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="screenshots/dark/landing_hero_dark.png">
    <source media="(prefers-color-scheme: light)" srcset="screenshots/light/landing_hero_light.png">
    <img src="screenshots/light/landing_hero_light.png" alt="SARAL Landing Page" width="100%"/>
  </picture>
  <p><i>Landing portal with single-window overview and department navigation.</i></p>
</div>

#### 2. Public Transparency & Subsidy Calculator
<div align="center">
  <img src="screenshots/light/public_transparency_dashboard.png" alt="Public Transparency Dashboard" width="100%"/>
  <p><i><b>Public Transparency Dashboard:</b> Open governance statistics, clearance trends, and departmental metrics.</i></p>
</div>

<br/>

<div align="center">
  <img src="screenshots/light/subsidy_calculator.png" alt="Government Subsidy Calculator" width="100%"/>
  <p><i><b>Government Subsidy & Incentive Calculator:</b> Instant calculation of eligible capital subsidies and exemptions.</i></p>
</div>

---

### Phase 2: Authenticated Entrepreneur / Applicant Journey

#### 3. Applicant Dashboard
<div align="center">
  <img src="screenshots/light/applicant_dashboard.png" alt="Applicant Dashboard" width="100%"/>
  <p><i><b>Applicant Dashboard:</b> Active clearances summary, application progress tracking, and pending actions.</i></p>
</div>

#### 4. Know Your Approvals (KYA) AI Assistant
<div align="center">
  <img src="screenshots/light/KYA_AI.png" alt="Know Your Approvals AI" width="100%"/>
  <p><i><b>Know Your Approvals (AI-Assisted):</b> Step-by-step questionnaire generating the required clearance checklist based on business parameters.</i></p>
</div>

#### 5. Smart Document Vault
<div align="center">
  <img src="screenshots/light/smart_vault_view.png" alt="Smart Document Vault" width="100%"/>
  <p><i><b>Smart Document Vault:</b> Centralized digital repository for verified certificates, renewal alerts, and reusable files.</i></p>
</div>

---

### Phase 3: Local District Authority Workflow

#### 6. Local Officer Review Queue
<div align="center">
  <img src="screenshots/light/local_officer_queue.png" alt="Local Officer Queue" width="100%"/>
  <p><i><b>Local Officer Task Queue:</b> District-filtered application requests with AI verification indicators.</i></p>
</div>

#### 7. Site Inspection Scheduling
<div align="center">
  <img src="screenshots/light/inspection_scheduler_modal.png" alt="Inspection Scheduler Modal" width="100%"/>
  <p><i><b>Inspection Planner:</b> Selecting field visit dates, assigning inspectors, and triggering applicant notification.</i></p>
</div>

---

### Phase 4: Main State Authority & SLA Governance

#### 8. State Authority Command Center & SLA Escalation Panel

<table width="100%">
  <tr>
    <td width="50%" align="center">
      <h4>🏛️ Main Authority Dashboard</h4>
      <img src="screenshots/light/main_authority_panel.png" alt="Main Authority Command Center" width="100%"/>
      <p><i>Macro clearance metrics, state-wide statistics, and policy catalog management.</i></p>
    </td>
    <td width="50%" align="center">
      <h4>⏱️ SLA Auto-Escalation Monitor</h4>
      <img src="screenshots/light/auto_escalation_panel.png" alt="Auto Escalation Panel" width="100%"/>
      <p><i>Applications stalled past statutory deadlines escalated to senior administrators.</i></p>
    </td>
  </tr>
</table>

---

## 🛠️ Technology Stack

Only the technologies actually utilized in the codebase and technical architecture:

<div align="center">

<a href="https://skillicons.dev">
  <img src="https://skillicons.dev/icons?i=react,tailwind,nodejs,express,mongodb,redis" />
</a>

<br/><br/>

| Component | Technology | Role in SARAL |
|---|---|---|
| **Frontend** | React, Vite | Dynamic single-page application for all 3 portals |
| **Styling** | Tailwind CSS | Modern, responsive interface design with theme support |
| **UI Components** | Lucide-React, Framer-Motion | Visual icons and smooth modal transitions |
| **Backend** | Node.js, Express | REST API routing, user authentication, and business logic |
| **Database** | MongoDB | Document database for applications, users, and scheme catalogs |
| **Caching** | Redis | Caching high-traffic catalog and public stats queries |
| **AI Integration** | Google Gemini API | Document verification and interactive KYA query solving |
| **File Storage** | Cloudinary | Cloud storage for uploaded PDFs and verified certificates |
| **Email Alerts** | Nodemailer | Automated notifications for inspections, approvals, and renewals |

</div>

---

## 🚀 Running the Project Locally

### Prerequisites
* **Node.js**: `v18+`
* **npm**: `v9+`
* **MongoDB**: Local instance or MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/CoDerHarsh5180/SIH-Hexagon.git
cd SIH-Hexagon
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 👥 Team Hexagon

**Smart India Hackathon 2026** | **Team ID: 131088**

| Member | Profile |
|---|---|
| **Harsh** | [@CoDerHarsh5180](https://github.com/CoDerHarsh5180) |
| **Ritika** | [@ritika-vishwa](https://github.com/ritika-vishwa) |
| **Yash** | [@yash-sharmaji](https://github.com/yash-sharmaji) |
| **Satyam** | [@Satyam-Sagar-25](https://github.com/Satyam-Sagar-25) |
| **Dheeraj** | [@Dheeraj7979](https://github.com/Dheeraj7979) |
| **Abhijeet** | [@abhijeetmishra15-codes](https://github.com/abhijeetmishra15-codes) |

---

## 📄 License & Acknowledgments

* Licensed under the **MIT License**.
* Developed for **Smart India Hackathon 2026** (Problem Statement `SIH26130`).
* Project reference guidelines from **Government of Maharashtra (MAITRI)** and **DPIIT**.

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=%23EA580C,%23F97316,%2316A34A&height=100&section=footer" width="100%"/>
</div>
