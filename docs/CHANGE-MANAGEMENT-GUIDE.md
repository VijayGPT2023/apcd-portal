# APCD Portal — Change Management Guide

## For Decision Makers & Project Managers

**Version:** 1.0 | **Date:** March 2026
**Prepared for:** National Productivity Council (NPC) / CPCB

---

## How This Portal Works — A Simple Analogy

Think of this portal like a **government office building**:

| Building Part                      | Portal Equivalent                     | Who Decides Changes    | Who Implements        |
| ---------------------------------- | ------------------------------------- | ---------------------- | --------------------- |
| Signboards, posters, notice boards | Text, images, headers, footer         | Content team / Officer | Developer (30 min)    |
| Fee counter rates, form fields     | Fee amounts, form changes, user roles | Management / Committee | Developer (1-2 days)  |
| Building layout, room allocation   | Business process flow                 | Director / Ministry    | Developer (1-4 weeks) |

**The key insight:** In 90% of changes, the bottleneck is the **decision**, not the coding. Once you decide "the application fee should be ₹30,000 instead of ₹25,000", the developer can implement it in 15 minutes.

---

## Category 1: Content & Display Changes

**What changes:** What users see — text, images, colors, page layout, labels, footer, header
**Decision maker:** Content team, Officer-in-charge, Project Manager
**Coding effort:** ⬤○○○○ Minimal (30 minutes to 2 hours)
**Risk:** None — no business logic is affected
**Testing needed:** Visual check on browser only

### All Possible Scenarios

| #    | Change Request                                                | What Decision Maker Provides                                   | Developer's Work                                                    | Time           |
| ---- | ------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- | -------------- |
| 1.1  | Change portal name or tagline                                 | New text (e.g., "APCD Empanelment System" instead of "Portal") | Edit 1 line in translation file                                     | 15 min         |
| 1.2  | Change NPC logo or CPCB logo                                  | New logo image file (PNG/SVG, transparent background)          | Replace image file, adjust size if needed                           | 30 min         |
| 1.3  | Add Minister's photo or Chairman's message                    | Photo file + message text                                      | Add section to landing page                                         | 1-2 hours      |
| 1.4  | Change hero banner image on homepage                          | New banner image (1920×600px recommended)                      | Replace image, adjust positioning                                   | 30 min         |
| 1.5  | Update contact address or phone number                        | New address/phone/email text                                   | Edit translation file                                               | 15 min         |
| 1.6  | Add or modify FAQ question                                    | New question + answer text in English and Hindi                | Edit translation file                                               | 15 min per FAQ |
| 1.7  | Change header navigation links                                | Which links to show/hide                                       | Edit header component                                               | 30 min         |
| 1.8  | Add footer links (RTI, Citizen's Charter, etc.)               | List of links with URLs                                        | Edit footer section                                                 | 30 min         |
| 1.9  | Change color theme (blue to green, etc.)                      | Preferred color code or reference website                      | Edit 2-3 CSS variables                                              | 1 hour         |
| 1.10 | Add a new static page (e.g., About Us, Guidelines)            | Page content in English + Hindi                                | Create new page file                                                | 1-2 hours      |
| 1.11 | Update Privacy Policy or Terms of Use                         | New legal text (from legal team)                               | Replace text in existing page                                       | 30 min         |
| 1.12 | Add Hindi translation for any page                            | Hindi text for all labels/content                              | Add entries to hi.json file                                         | 1-2 hours      |
| 1.13 | Change button labels (e.g., "Submit" to "Submit Application") | New label text                                                 | Edit translation file                                               | 15 min         |
| 1.14 | Add government disclaimer banner                              | Disclaimer text                                                | Add banner component to layout                                      | 1 hour         |
| 1.15 | Change fee amounts shown on landing page                      | New amounts                                                    | Edit translation file (display only — see 2.1 for actual fee logic) | 15 min         |
| 1.16 | Add "Last updated" date on pages                              | Which pages need it                                            | Add date display to pages                                           | 30 min         |
| 1.17 | Add social media links                                        | URLs for Twitter/X, Facebook, YouTube                          | Add icons to footer                                                 | 30 min         |
| 1.18 | Change email template design (notifications)                  | Preferred layout/colors                                        | Edit email template HTML                                            | 1-2 hours      |
| 1.19 | Add announcement/ticker on homepage                           | Announcement text, start/end date                              | Add ticker component                                                | 1-2 hours      |
| 1.20 | Mobile app store links (if app is created later)              | App Store / Play Store URLs                                    | Add download buttons                                                | 30 min         |

### What You Need to Provide (Checklist)

For any content change, prepare:

- ☐ Exact text in **English**
- ☐ Exact text in **Hindi** (for bilingual pages)
- ☐ Image files if applicable (minimum 300 DPI for print, 72 DPI for web)
- ☐ Approval from competent authority (file noting)
- ☐ Effective date (when should the change go live?)

---

## Category 2: Configuration & Data Changes

**What changes:** Values that control business behavior — fees, form fields, user accounts, validation rules, document types
**Decision maker:** Project Director, Committee, Competent Authority
**Coding effort:** ⬤⬤⬤○○ Medium (2 hours to 3 days)
**Risk:** Low to Medium — affects calculations, forms, or access control
**Testing needed:** Functional testing of affected feature

### All Possible Scenarios

#### 2A. Fee & Payment Changes

| #    | Change Request                                                    | Decision Required                                                          | Developer's Work                                                                 | Time     |
| ---- | ----------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------- |
| 2.1  | Change application fee (e.g., ₹25,000 → ₹30,000)                  | New fee amount, effective date, whether existing applications are affected | Update fee configuration in database (1 SQL query) + update landing page display | 30 min   |
| 2.2  | Change empanelment fee per APCD type                              | New amount per type                                                        | Same as above                                                                    | 30 min   |
| 2.3  | Change GST rate (18% → 12%)                                       | New GST percentage                                                         | Update fee calculation formula                                                   | 1 hour   |
| 2.4  | Change MSE/startup discount (15% → 20%)                           | New discount percentage                                                    | Update discount logic                                                            | 1 hour   |
| 2.5  | Add new fee type (e.g., "Surveillance Visit Fee")                 | Fee name, amount, when it applies                                          | Add new payment type to database + update checkout page                          | 1 day    |
| 2.6  | Remove a fee type                                                 | Which fee to remove                                                        | Disable fee type in configuration                                                | 1 hour   |
| 2.7  | Change payment gateway (Razorpay → BillDesk)                      | New gateway credentials, API documentation                                 | Replace payment integration code                                                 | 3-5 days |
| 2.8  | Add UPI/BHIM as payment option                                    | Decision to add, UPI ID for receiving                                      | Configure in Razorpay dashboard (no code change)                                 | 30 min   |
| 2.9  | Change bank account for NEFT payments                             | New account details                                                        | Update bank details in database                                                  | 15 min   |
| 2.10 | Fee waiver for specific category (e.g., government organizations) | Waiver criteria, approval process                                          | Add waiver logic to fee calculator                                               | 1 day    |

#### 2B. Form & Document Changes

| #    | Change Request                                                      | Decision Required                                               | Developer's Work                              | Time      |
| ---- | ------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------- | --------- |
| 2.11 | Add a new field to application form (e.g., "Website URL")           | Field name, data type (text/number/date), mandatory or optional | Add field to database schema + form UI + API  | 2-4 hours |
| 2.12 | Remove a field from application form                                | Which field, what happens to existing data                      | Hide field from UI (keep data for records)    | 1 hour    |
| 2.13 | Make an optional field mandatory                                    | Which field                                                     | Change validation rule                        | 30 min    |
| 2.14 | Add new document type (e.g., "Pollution Control Board NOC")         | Document name, mandatory/optional, which step                   | Add to document type enum + update validation | 2 hours   |
| 2.15 | Remove a document type                                              | Which document                                                  | Disable document type (keep existing uploads) | 30 min    |
| 2.16 | Change file size limit (10MB → 25MB)                                | New limit                                                       | Change 1 environment variable                 | 5 min     |
| 2.17 | Add new APCD category (e.g., "Carbon Capture Systems")              | Category name, subcategories                                    | Add to APCD types in database                 | 30 min    |
| 2.18 | Remove/disable an APCD category                                     | Which category                                                  | Toggle status in admin panel (no code change) | 5 min     |
| 2.19 | Add new Annexure (e.g., Annexure 8: Environmental Clearance)        | Annexure format, fields, which step it belongs to               | Create new form section + database model      | 2-3 days  |
| 2.20 | Change form step order (e.g., move Documents to Step 1)             | New step sequence                                               | Reorder step components                       | 1 day     |
| 2.21 | Add conditional fields (show field X only if user selects option Y) | Condition logic                                                 | Add conditional rendering                     | 2-4 hours |

#### 2C. User & Role Changes

| #    | Change Request                                                          | Decision Required                                 | Developer's Work                                             | Time     |
| ---- | ----------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ | -------- |
| 2.22 | Create new user account (Officer, Committee Member, etc.)               | Name, email, role, phone                          | Admin panel → User Management → Create User (no code change) | 5 min    |
| 2.23 | Deactivate a user account                                               | Which user                                        | Admin panel → Toggle Status (no code change)                 | 2 min    |
| 2.24 | Change user's role (Officer → Admin)                                    | Which user, new role                              | Admin panel → Edit User (no code change)                     | 2 min    |
| 2.25 | Add a new role (e.g., "Regional Officer")                               | Role name, what they can access, what they can do | Add role to enum + define permissions + update guards        | 3-5 days |
| 2.26 | Change what a role can do (e.g., Officers can now approve applications) | New permission matrix                             | Update role-based access control rules                       | 1-2 days |
| 2.27 | Add delegation (Officer A covers for Officer B during leave)            | Delegation rules, duration                        | Use existing delegation feature (no code change)             | 5 min    |
| 2.28 | Bulk user creation (50 State officers)                                  | CSV/Excel with name, email, role                  | Write bulk import script                                     | 2 hours  |

#### 2D. Validation & Business Rule Changes

| #    | Change Request                                                   | Decision Required                  | Developer's Work                                  | Time     |
| ---- | ---------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------- | -------- |
| 2.29 | Change minimum installations requirement (3 → 5)                 | New threshold                      | Update validation rule (1 line)                   | 15 min   |
| 2.30 | Change minimum company age (3 years → 5 years)                   | New threshold                      | Update eligibility checker                        | 30 min   |
| 2.31 | Change committee evaluation criteria (8 → 10 criteria)           | New criteria names, max marks each | Add criteria to database + update evaluation form | 1-2 days |
| 2.32 | Change pass threshold (60 → 70 marks)                            | New passing score                  | Update 1 constant                                 | 15 min   |
| 2.33 | Change certificate validity (2 years → 3 years)                  | New validity period                | Update certificate generation                     | 30 min   |
| 2.34 | Change password policy (e.g., require 12 characters)             | New policy                         | Update validation regex                           | 30 min   |
| 2.35 | Add geo-fencing for factory photos (only India)                  | Already implemented                | No change needed                                  | 0 min    |
| 2.36 | Change rate limits (allow more/fewer requests per minute)        | New limits                         | Change environment variable                       | 5 min    |
| 2.37 | Change OTP validity period (10 min → 5 min)                      | New duration                       | Update 1 constant                                 | 15 min   |
| 2.38 | Change renewal reminder period (60 days → 90 days before expiry) | New period                         | Update 1 constant                                 | 15 min   |

### What You Need to Provide (Checklist)

For any configuration change, prepare:

- ☐ Exact new value/rule (not vague — "increase fee" is not enough, "change to ₹35,000" is)
- ☐ Effective date
- ☐ What happens to existing data/applications (grandfather clause?)
- ☐ Committee/authority approval (office order/minutes)
- ☐ Impact assessment (who is affected — all applicants, new applicants only, specific category?)

---

## Category 3: Business Process Changes

**What changes:** How work flows through the system — new approval stages, new workflows, new integrations with external systems
**Decision maker:** Director/Ministry/Committee with formal approval
**Coding effort:** ⬤⬤⬤⬤⬤ Significant (1 week to 2 months)
**Risk:** High — affects core functionality, all users, data integrity
**Testing needed:** Full regression testing + user acceptance testing (UAT)

### All Possible Scenarios

| #    | Change Request                                                                                             | Why It's Complex                                                        | Developer's Work                                                              | Time       |
| ---- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------- |
| 3.1  | Add new workflow stage (e.g., "Lab Testing" becomes mandatory between Field Verification and Final Review) | New status, new transitions, new UI screens, new role assignment        | Add status to enum, update state machine, create new pages, update dashboards | 2-3 weeks  |
| 3.2  | Split application into multi-phase (Phase 1: Document, Phase 2: Site Visit)                                | Entire application lifecycle redesign                                   | Major refactor of application model + UI + workflow                           | 1-2 months |
| 3.3  | Add appeal/grievance mechanism (rejected applicant can appeal)                                             | New workflow parallel to main process                                   | New module: appeal submission, review panel, decision tracking                | 3-4 weeks  |
| 3.4  | Integration with external system (e.g., GST portal for auto-verification)                                  | API integration, data mapping, error handling                           | Build integration service, handle API failures, sync data                     | 2-4 weeks  |
| 3.5  | Integration with DigiLocker for document fetch                                                             | DigiLocker API registration, OAuth flow                                 | New integration module                                                        | 2-3 weeks  |
| 3.6  | Integration with Aadhaar/eKYC for identity verification                                                    | UIDAI API, biometric handling, compliance                               | New verification module + compliance audit                                    | 1-2 months |
| 3.7  | Add digital signature (DSC) for certificate signing                                                        | DSC provider integration, PDF signing workflow                          | Integrate signing library + certificate template update                       | 2-3 weeks  |
| 3.8  | Multi-level approval (application needs 3 approvals instead of 1)                                          | Approval chain, notification at each level, dashboard for each approver | New approval workflow engine                                                  | 3-4 weeks  |
| 3.9  | Branch/regional office support (state-wise assignment of officers)                                         | Multi-tenancy, region-based access, officer mapping                     | Database restructuring + access control update                                | 1-2 months |
| 3.10 | Auto-scheduling of field verification visits                                                               | Calendar integration, verifier availability, travel optimization        | New scheduling module                                                         | 2-3 weeks  |
| 3.11 | Vendor rating system (rate empaneled OEMs based on performance)                                            | Rating criteria, who rates, how scores affect renewal                   | New module: ratings, reviews, score calculation                               | 2-3 weeks  |
| 3.12 | Merge with another portal (e.g., combine with emission monitoring system)                                  | Data migration, user merging, unified login                             | Major architectural change                                                    | 2-3 months |
| 3.13 | Switch from manual committee evaluation to AI-assisted scoring                                             | ML model training, scoring algorithm, human override                    | Build AI scoring service + review interface                                   | 1-2 months |
| 3.14 | Add e-auction for empanelment slots (if limited slots)                                                     | Auction engine, bidding rules, payment handling                         | Entirely new module                                                           | 1-2 months |
| 3.15 | Add public dashboard showing empanelment statistics nationwide                                             | Data aggregation, charts, public API                                    | New public analytics page + API endpoints                                     | 1-2 weeks  |

### What You Need to Provide (Checklist)

For any process change, prepare:

- ☐ Detailed process flow diagram (who does what, in what order)
- ☐ Decision matrix (what happens at each decision point)
- ☐ Role assignment (which role handles each step)
- ☐ SLA/timeline for each step
- ☐ Exception handling (what if someone doesn't act within SLA?)
- ☐ Data requirements (what new information needs to be captured?)
- ☐ Formal approval from competent authority (office order)
- ☐ Budget allocation for development effort
- ☐ UAT team identified (who will test the new process?)

---

## Summary: Decision Timeline vs Coding Timeline

```
                    Decision Time          Coding Time
                    ─────────────          ───────────
Category 1          1 day - 2 weeks       15 min - 2 hours
(Content)           (content approval)

Category 2          1 week - 3 months     30 min - 5 days
(Configuration)     (committee/approval)

Category 3          1 month - 1 year      1 week - 2 months
(Process)           (ministry/directive)
```

**The pattern is clear:** Decision-making takes 10-100x longer than implementation. The fastest way to get changes done is to:

1. **Finalize the decision** with all stakeholders
2. **Document it precisely** (exact values, not vague requirements)
3. **Hand it to the developer** with the checklist completed

---

## Who Does What?

| Person               | Responsibility                                               | Examples                          |
| -------------------- | ------------------------------------------------------------ | --------------------------------- |
| **Project Director** | Approves Category 2 and 3 changes                            | Fee revision, new workflow stages |
| **Committee**        | Decides evaluation criteria, pass marks, new APCD categories | Category 2D and 2B changes        |
| **Content Manager**  | Provides text, images, translations                          | All Category 1 changes            |
| **Admin User**       | Creates users, toggles APCD types, manages fees              | Items marked "no code change"     |
| **Developer**        | Implements approved changes, runs tests, deploys             | All categories after decision     |

---

## What Admin Can Do WITHOUT Any Developer

These actions can be performed directly from the Admin Dashboard (https://portal/admin):

| Action                                 | Where in Admin Panel      |
| -------------------------------------- | ------------------------- |
| Create/edit/deactivate user accounts   | Admin → User Management   |
| Toggle APCD type active/inactive       | Admin → APCD Types        |
| View/update fee configuration          | Admin → Fee Configuration |
| View audit logs                        | Admin → Audit Logs        |
| View MIS reports                       | Admin → Reports           |
| View all applications and their status | Admin → Applications      |
| View/revoke certificates               | Admin → Certificates      |

**No developer, no code, no deployment needed for these.**

---

## Maintenance Calendar (Recommended)

| Frequency | Activity                                   | Who                       |
| --------- | ------------------------------------------ | ------------------------- |
| Daily     | Check portal is accessible (health check)  | Ops team                  |
| Weekly    | Review error logs for unusual patterns     | Developer                 |
| Monthly   | Update translations for any new content    | Content team              |
| Quarterly | Review and update fee structure if needed  | Committee + Developer     |
| Annually  | Renew SSL certificate, update dependencies | Developer                 |
| Annually  | Security audit (OWASP scan)                | Developer + Security team |
| As needed | Database backup verification               | Ops team                  |

---

## Cost Estimation Guide

For budgeting purposes, here's a rough effort-to-cost mapping:

| Effort Level | Developer Days | Approximate Cost\* |
| ------------ | -------------- | ------------------ |
| 15 minutes   | 0.03 day       | Negligible         |
| 2 hours      | 0.25 day       | ₹2,500             |
| 1 day        | 1 day          | ₹10,000            |
| 3 days       | 3 days         | ₹30,000            |
| 1 week       | 5 days         | ₹50,000            |
| 2 weeks      | 10 days        | ₹1,00,000          |
| 1 month      | 22 days        | ₹2,20,000          |
| 2 months     | 44 days        | ₹4,40,000          |

\*Based on ₹10,000/day for an experienced full-stack developer. Actual costs may vary based on vendor rates, government contract terms, and complexity.

---

## Document Version History

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.0     | March 2026 | Initial version |

---

_Prepared by the APCD Portal Development Team for NPC project management and decision-making stakeholders._
