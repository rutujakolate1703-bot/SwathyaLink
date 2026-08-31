Build a production‑ready web app called “RuralCare OS” – an integrated care‑access and quality support platform for rural and underserved communities in India. The app must be offline‑first, multilingual, voice‑friendly, and designed for low‑connectivity environments. It should strengthen (not replace) the public health system by supporting frontline health workers (ASHA/ANM), sub‑centres, PHCs, rural hospitals, and district hospitals with continuity of information.

PRODUCT VISION
Create a modular platform that combines:
1) Assisted teleconsultation (health‑worker mediated and patient‑facing)
2) Appointment and queue management with digital tokens
3) AI‑powered digital triage (voice + text, multilingual)
4) Longitudinal patient records interoperable with India’s ABDM (ABHA + FHIR R4)
5) Referral tracking and diagnostic coordination
6) Medicine availability visibility at facility level
7) High‑risk patient follow‑up (maternal, child, chronic/NCD)
8) Facility dashboards for quality monitoring and accountability
9) Emergency escalation with one‑tap SOS and pre‑filled clinical summary
10) Interoperability and compliance hooks for ABDM (ABHA, HPR/HFR, HIE‑CM consent, UHI, FHIR)

DIFFERENTIATORS (MUST HAVE)
- Offline‑first architecture: core flows (triage, token generation, consult notes, prescriptions, referrals) must work without internet and auto‑sync when online.
- Voice‑first, multilingual UI: support at least Hindi, English, Marathi, Tamil, Telugu, Bengali, Kannada, Gujarati, Punjabi, Odia. Include voice navigation and voice input for semi‑literate users.
- Assisted mode: health worker can create/manage patient sessions on behalf of patients (shared device friendly).
- ABDM‑ready: design data models and APIs to map to ABHA health ID and FHIR R4 resources (Patient, Encounter, Observation, CarePlan, Condition, MedicationRequest, DiagnosticReport, ReferralRequest, Immunization). Include a “FHIR export” button per patient.
- Smart referral & diagnostics: track referral status end‑to‑end (initiated → accepted → completed/no‑show) and show diagnostic test availability/turnaround time at linked facilities.
- Medicine stock visibility: simple inventory module per facility showing essential medicine availability; flag stock‑outs on dashboards.
- High‑risk registries: maintain registries for ANC/PNC, under‑5 children, and NCDs (diabetes, hypertension, TB) with scheduled follow‑ups, task lists for ASHA/ANM, and escalation rules for missed visits/danger signs.
- Quality dashboards: facility and program dashboards showing wait time, teleconsult volume, referral completion rate, follow‑up adherence, stock‑out rate, and key maternal/child/NCD indicators.
- Emergency SOS: one‑tap emergency button that shares location and a pre‑filled clinical summary to the nearest facility/ambulance.

USER ROLES
- Patient (rural user): simple, large‑text, voice‑enabled interface; can view own records, tokens, referrals, and follow‑ups.
- Frontline Health Worker (ASHA/ANM): create/verify ABHA, perform triage, generate tokens, manage follow‑ups, view task list, initiate referrals, update medicine stock.
- Doctor (PHC/rural hospital/district hospital): view queue, conduct teleconsults, write FHIR‑style prescriptions, create referrals, view patient longitudinal record.
- Facility Admin: manage users, facilities, medicine inventory, view dashboards, configure referral networks.
- Super Admin (program level): multi‑facility analytics, ABDM integration settings, consent audit logs.

CORE PAGES / SCREENS
1) Onboarding & Auth
- Role selection (Patient, Health Worker, Doctor, Admin)
- ABHA creation/verification flow (mocked for demo, but UI ready for ABDM APIs)
- Multilingual toggle + voice input toggle
- Offline indicator and sync status

2) Health Worker Dashboard
- Today’s tasks (follow‑ups, ANC/PNC visits, NCD checks)
- Quick actions: New Patient, Triage, Generate Token, Start Teleconsult, Create Referral
- Queue overview for assigned facility
- Medicine stock alerts
- High‑risk patient list with due dates

3) Patient Dashboard
- Upcoming appointments and tokens
- Active referrals and diagnostics
- Follow‑up schedule (maternal/child/chronic)
- Personal health record summary (ABHA linked)
- SOS emergency button

4) Digital Triage
- Voice/text symptom entry in multiple languages
- Rule‑based triage engine (self‑care / PHC / referral)
- Optional AI image upload for skin/wound assessment (mocked)
- Triage result with recommended next step and estimated wait time

5) Queue & Appointment Management
- Digital token generation (QR + numeric token) linked to ABHA
- Live queue display per facility and per doctor
- Appointment scheduling with reminders (SMS/WhatsApp mock)
- Walk‑in token support

6) Teleconsultation Room
- Video/audio/chat consult (mock WebRTC for demo)
- Consult note template mapped to FHIR Encounter + ClinicalNote
- e‑Prescription generator (FHIR MedicationRequest)
- Referral creator (FHIR ReferralRequest)
- Option to attach images/documents

7) Longitudinal Patient Record
- Timeline view of encounters, prescriptions, diagnostics, referrals, immunizations
- FHIR export button (JSON)
- Consent log (who accessed what, when)
- ABHA linkage status

8) Referral & Diagnostic Coordination
- Create referral with reason, urgency, target facility
- Track status (initiated, accepted, completed, no‑show)
- Diagnostic test booking with facility‑wise availability and TAT
- Referral completion feedback form

9) Medicine Availability
- Facility inventory list (essential medicines)
- Stock‑in/stock‑out updates
- Dashboard widget: % facilities with stock‑outs per medicine

10) High‑Risk Follow‑Up
- Registries: ANC/PNC, under‑5, NCD (diabetes, HTN, TB)
- Task list for ASHA/ANM with due dates and escalation rules
- Missed visit alerts and danger sign flags
- Simple care plan view (FHIR CarePlan style)

11) Facility & Program Dashboards
- Wait time, queue length, teleconsult volume
- Referral completion rate, diagnostic TAT
- Follow‑up adherence (ANC 4+, HTN control, etc.)
- Medicine stock‑out rate
- Map view of facilities with key indicators

12) Emergency SOS
- One‑tap SOS button
- Share location + pre‑filled clinical summary to nearest facility
- Call ambulance / emergency contact

TECHNICAL REQUIREMENTS
- Offline‑first: use local storage (IndexedDB / PWA) with background sync when online.
- Multilingual: i18n framework with at least 10 Indian languages; all labels and voice prompts localized.
- Voice UI: integrate browser speech recognition and TTS; provide voice navigation for key flows (triage, token, SOS).
- ABDM/FHIR ready: design data models to map cleanly to FHIR R4; include a “FHIR export” per patient and a settings page for ABDM API endpoints (mocked).
- Security & privacy: role‑based access control, audit logs, consent capture UI, encryption in transit (HTTPS) and at rest (DB level).
- Responsive design: mobile‑first for health workers and patients; desktop‑friendly for doctors and admins.
- Extensibility: modular components so new modules (e.g., lab integration, e‑pharmacy) can be added later without rewriting core.

DATA MODEL (MINIMUM)
- User (id, role, name, phone, language, facility_id)
- Facility (id, name, type [sub‑centre/PHC/rural hospital/district], location, contact)
- Patient (id, abha_id, name, dob, gender, phone, address, high_risk_flags[])
- Encounter (id, patient_id, facility_id, doctor_id, type [tele/in‑person], notes, fhir_json)
- Token (id, patient_id, facility_id, doctor_id, token_number, status, created_at)
- Referral (id, patient_id, from_facility_id, to_facility_id, reason, urgency, status, fhir_json)
- DiagnosticRequest (id, patient_id, test_type, facility_id, status, tat_hours)
- MedicationRequest (id, patient_id, medicines[], fhir_json)
- MedicineStock (id, facility_id, medicine_name, quantity, status [in_stock/low/out])
- FollowUpTask (id, patient_id, type [ANC/PNC/NCD/child], due_date, status, assigned_to)
- DashboardMetric (id, facility_id, metric_name, value, date)

DESIGN & UX
- Clean, high‑contrast UI with large touch targets.
- Simple icons + text + voice for low‑literacy users.
- Clear offline/online status indicators.
- Empty states and helpful tooltips for every module.
- Consistent navigation bar with role‑based menu.

DELIVERABLES FROM LOVABLE
- Complete frontend with all screens above, wired with mock data and local state.
- Supabase (or similar) backend schema matching the data model, with RLS policies per role.
- Auth flows for all roles, with session management.
- Basic analytics pages for dashboards (can be mock charts initially).
- Settings page for ABDM/FHIR endpoints and feature flags.
- README with instructions to run locally and how to swap mock data for real ABDM/FHIR APIs later.

GOAL
Produce a flexible, extensible MVP that clearly demonstrates:
- Offline‑first, voice‑enabled, multilingual rural health platform
- End‑to‑end patient journey from triage → token → teleconsult → referral → diagnostics → follow‑up
- ABDM/FHIR‑ready data model and export
- Facility and program dashboards for quality and accountability
This should feel more advanced and context‑aware than generic telemedicine apps by explicitly solving rural constraints (offline, language, literacy, assisted mode, public‑health workflows).
