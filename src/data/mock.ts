export const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
];

export const t: Record<string, Record<string, string>> = {
  en: {
    appName: "RuralCare OS",
    tagline: "Integrated care for every village",
    dashboard: "Dashboard",
    triage: "Triage",
    queue: "Queue & Tokens",
    teleconsult: "Teleconsult",
    patients: "Patients",
    referrals: "Referrals",
    medicines: "Medicine Stock",
    followups: "Follow-ups",
    analytics: "Analytics",
    settings: "Settings",
    sos: "SOS Emergency",
    logout: "Logout",
    offline: "Offline",
    online: "Online",
    voiceOn: "Voice On",
    voiceOff: "Voice Off",
    newPatient: "New Patient",
    generateToken: "Generate Token",
    startConsult: "Start Teleconsult",
    createReferral: "Create Referral",
    todayTasks: "Today's Tasks",
    highRiskPatients: "High-Risk Patients",
    queueOverview: "Queue Overview",
    medicineAlerts: "Medicine Alerts",
    search: "Search...",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    selectRole: "Select your role to continue",
    welcomeBack: "Welcome back",
    goodMorning: "Good morning",
    patients_served: "Patients Served",
    pending_tasks: "Pending Tasks",
    stock_alerts: "Stock Alerts",
    teleconsults_today: "Teleconsults Today",
  },
  hi: {
    appName: "रूरलकेयर ओएस",
    tagline: "हर गांव के लिए एकीकृत स्वास्थ्य सेवा",
    dashboard: "डैशबोर्ड",
    triage: "ट्राइएज",
    queue: "कतार",
    teleconsult: "टेलीकंसल्ट",
    patients: "मरीज़",
    referrals: "रेफरल",
    medicines: "दवाएं",
    followups: "फॉलो-अप",
    analytics: "विश्लेषण",
    settings: "सेटिंग्स",
    sos: "आपातकाल",
    logout: "लॉगआउट",
    offline: "ऑफलाइन",
    online: "ऑनलाइन",
    voiceOn: "आवाज़ चालू",
    voiceOff: "आवाज़ बंद",
    newPatient: "नया मरीज़",
    generateToken: "टोकन बनाएं",
    startConsult: "परामर्श शुरू करें",
    createReferral: "रेफरल बनाएं",
    todayTasks: "आज के कार्य",
    highRiskPatients: "उच्च-जोखिम मरीज़",
    queueOverview: "कतार स्थिति",
    medicineAlerts: "दवा अलर्ट",
    search: "खोजें...",
    save: "सहेजें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    selectRole: "जारी रखने के लिए भूमिका चुनें",
    welcomeBack: "वापस स्वागत है",
    goodMorning: "सुप्रभात",
    patients_served: "मरीज़ सेवित",
    pending_tasks: "लंबित कार्य",
    stock_alerts: "स्टॉक अलर्ट",
    teleconsults_today: "आज की टेलीकंसल्ट",
  },
};

export type Role = "patient" | "health_worker" | "doctor" | "facility_admin" | "super_admin";

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  language: string;
  facilityId: string | null;
  abhaId: string | null;
}

export const mockUsers: User[] = [
  { id: "u1", role: "health_worker", name: "Priya Devi", phone: "+91-9876543210", language: "hi", facilityId: "f1", abhaId: null },
  { id: "u2", role: "patient", name: "Ramesh Kumar", phone: "+91-9765432109", language: "hi", facilityId: "f1", abhaId: "ABHA-2345-6789-0123" },
  { id: "u3", role: "doctor", name: "Dr. Anjali Singh", phone: "+91-9654321098", language: "en", facilityId: "f1", abhaId: null },
  { id: "u4", role: "facility_admin", name: "Suresh Patil", phone: "+91-9543210987", language: "mr", facilityId: "f1", abhaId: null },
  { id: "u5", role: "super_admin", name: "Dr. Kavita Sharma", phone: "+91-9432109876", language: "en", facilityId: null, abhaId: null },
];

export const mockFacilities = [
  { id: "f1", name: "Bhimpur PHC", type: "PHC", location: "Bhimpur, Vidarbha, Maharashtra", contact: "+91-7152-234567" },
  { id: "f2", name: "Wardha Rural Hospital", type: "Rural Hospital", location: "Wardha, Maharashtra", contact: "+91-7152-245678" },
  { id: "f3", name: "Nagpur District Hospital", type: "District Hospital", location: "Nagpur, Maharashtra", contact: "+91-712-256789" },
  { id: "f4", name: "Pulgaon Sub-Centre", type: "Sub-Centre", location: "Pulgaon, Wardha", contact: "+91-7152-267890" },
];

export const mockPatients = [
  { id: "p1", abhaId: "ABHA-2345-6789-0123", name: "Ramesh Kumar", dob: "1985-03-15", gender: "M", phone: "+91-9765432109", address: "Village Bhimpur, Ward 3", highRiskFlags: ["HTN"], facilityId: "f1" },
  { id: "p2", abhaId: "ABHA-3456-7890-1234", name: "Sunita Bai", dob: "1998-07-22", gender: "F", phone: "+91-9654321098", address: "Village Pulgaon, Ward 1", highRiskFlags: ["ANC"], facilityId: "f1" },
  { id: "p3", abhaId: "ABHA-4567-8901-2345", name: "Mohan Rathod", dob: "1970-11-05", gender: "M", phone: "+91-9543210987", address: "Village Karanja, Ward 5", highRiskFlags: ["DM", "HTN"], facilityId: "f1" },
  { id: "p4", abhaId: "ABHA-5678-9012-3456", name: "Laxmi Deshmukh", dob: "2000-02-14", gender: "F", phone: "+91-9432109876", address: "Village Bhimpur, Ward 2", highRiskFlags: ["PNC"], facilityId: "f1" },
  { id: "p5", abhaId: "ABHA-6789-0123-4567", name: "Arjun Thakur", dob: "2022-05-10", gender: "M", phone: "+91-9321098765", address: "Village Wardha, Ward 7", highRiskFlags: ["under5"], facilityId: "f1" },
  { id: "p6", abhaId: "ABHA-7890-1234-5678", name: "Kamla Yadav", dob: "1955-09-30", gender: "F", phone: "+91-9210987654", address: "Village Bhimpur, Ward 4", highRiskFlags: ["TB"], facilityId: "f1" },
];

export const mockTokens = [
  { id: "t1", patientId: "p1", patientName: "Ramesh Kumar", facilityId: "f1", doctorId: "u3", tokenNumber: "B-001", status: "waiting", createdAt: "2024-01-15T08:30:00" },
  { id: "t2", patientId: "p2", patientName: "Sunita Bai", facilityId: "f1", doctorId: "u3", tokenNumber: "B-002", status: "in_progress", createdAt: "2024-01-15T08:45:00" },
  { id: "t3", patientId: "p3", patientName: "Mohan Rathod", facilityId: "f1", doctorId: "u3", tokenNumber: "B-003", status: "waiting", createdAt: "2024-01-15T09:00:00" },
  { id: "t4", patientId: "p4", patientName: "Laxmi Deshmukh", facilityId: "f1", doctorId: "u3", tokenNumber: "B-004", status: "waiting", createdAt: "2024-01-15T09:15:00" },
  { id: "t5", patientId: "p6", patientName: "Kamla Yadav", facilityId: "f1", doctorId: "u3", tokenNumber: "B-005", status: "completed", createdAt: "2024-01-15T07:30:00" },
  { id: "t6", patientId: "p5", patientName: "Arjun Thakur", facilityId: "f1", doctorId: "u3", tokenNumber: "B-006", status: "waiting", createdAt: "2024-01-15T09:45:00" },
];

export const mockReferrals = [
  { id: "r1", patientId: "p1", patientName: "Ramesh Kumar", fromFacilityId: "f1", toFacilityId: "f2", reason: "Uncontrolled hypertension, requires specialist evaluation", urgency: "urgent", status: "accepted", createdAt: "2024-01-14T10:00:00" },
  { id: "r2", patientId: "p2", patientName: "Sunita Bai", fromFacilityId: "f1", toFacilityId: "f3", reason: "High-risk ANC case, placenta previa suspected", urgency: "emergency", status: "initiated", createdAt: "2024-01-15T09:30:00" },
  { id: "r3", patientId: "p3", patientName: "Mohan Rathod", fromFacilityId: "f1", toFacilityId: "f2", reason: "Diabetic foot ulcer, surgical consultation needed", urgency: "routine", status: "completed", createdAt: "2024-01-10T11:00:00" },
  { id: "r4", patientId: "p6", patientName: "Kamla Yadav", fromFacilityId: "f1", toFacilityId: "f3", reason: "Drug-resistant TB suspected, requires DOTS-Plus center", urgency: "urgent", status: "no_show", createdAt: "2024-01-08T09:00:00" },
];

export const mockDiagnostics = [
  { id: "d1", patientId: "p1", patientName: "Ramesh Kumar", testType: "ECG", facilityId: "f2", status: "completed", tatHours: 2, requestedAt: "2024-01-14T10:00:00" },
  { id: "d2", patientId: "p2", patientName: "Sunita Bai", testType: "Obstetric USG", facilityId: "f3", status: "pending", tatHours: 24, requestedAt: "2024-01-15T09:30:00" },
  { id: "d3", patientId: "p3", patientName: "Mohan Rathod", testType: "HbA1c", facilityId: "f1", status: "completed", tatHours: 4, requestedAt: "2024-01-10T11:00:00" },
  { id: "d4", patientId: "p6", patientName: "Kamla Yadav", testType: "Sputum AFB", facilityId: "f1", status: "in_progress", tatHours: 48, requestedAt: "2024-01-13T08:00:00" },
];

export const mockMedicineStock = [
  { id: "m1", facilityId: "f1", medicineName: "Amlodipine 5mg", quantity: 450, status: "in_stock", unit: "tablets", reorderLevel: 100 },
  { id: "m2", facilityId: "f1", medicineName: "Metformin 500mg", quantity: 35, status: "low", unit: "tablets", reorderLevel: 100 },
  { id: "m3", facilityId: "f1", medicineName: "Iron + Folic Acid", quantity: 0, status: "out", unit: "tablets", reorderLevel: 200 },
  { id: "m4", facilityId: "f1", medicineName: "ORS Sachets", quantity: 250, status: "in_stock", unit: "sachets", reorderLevel: 50 },
  { id: "m5", facilityId: "f1", medicineName: "Amoxicillin 500mg", quantity: 0, status: "out", unit: "capsules", reorderLevel: 100 },
  { id: "m6", facilityId: "f1", medicineName: "Paracetamol 500mg", quantity: 800, status: "in_stock", unit: "tablets", reorderLevel: 200 },
  { id: "m7", facilityId: "f1", medicineName: "Rifampicin 450mg", quantity: 60, status: "low", unit: "capsules", reorderLevel: 100 },
  { id: "m8", facilityId: "f1", medicineName: "Vitamin D3 60K IU", quantity: 120, status: "in_stock", unit: "capsules", reorderLevel: 50 },
  { id: "m9", facilityId: "f1", medicineName: "Atenolol 50mg", quantity: 0, status: "out", unit: "tablets", reorderLevel: 100 },
  { id: "m10", facilityId: "f1", medicineName: "Salbutamol Inhaler", quantity: 15, status: "low", unit: "inhalers", reorderLevel: 20 },
];

export const mockFollowUps = [
  { id: "fu1", patientId: "p2", patientName: "Sunita Bai", type: "ANC", dueDate: "2024-01-15", status: "due", assignedTo: "u1", notes: "ANC visit 3 of 4. Check BP, Hb, fundal height." },
  { id: "fu2", patientId: "p4", patientName: "Laxmi Deshmukh", type: "PNC", dueDate: "2024-01-15", status: "due", assignedTo: "u1", notes: "PNC day 7. Check wound healing, breastfeeding support." },
  { id: "fu3", patientId: "p1", patientName: "Ramesh Kumar", type: "NCD", dueDate: "2024-01-15", status: "overdue", assignedTo: "u1", notes: "Monthly HTN follow-up. Check BP, medication adherence." },
  { id: "fu4", patientId: "p3", patientName: "Mohan Rathod", type: "NCD", dueDate: "2024-01-16", status: "upcoming", assignedTo: "u1", notes: "DM quarterly check. HbA1c review, foot exam." },
  { id: "fu5", patientId: "p5", patientName: "Arjun Thakur", type: "under5", dueDate: "2024-01-17", status: "upcoming", assignedTo: "u1", notes: "Growth monitoring, immunization check — OPV booster due." },
  { id: "fu6", patientId: "p6", patientName: "Kamla Yadav", type: "NCD", dueDate: "2024-01-14", status: "overdue", assignedTo: "u1", notes: "TB treatment adherence, DOTS check — missed last visit." },
];

export const mockEncounters = [
  { id: "e1", patientId: "p1", facilityId: "f1", doctorId: "u3", type: "teleconsult", date: "2024-01-10", notes: "BP 160/100 mmHg. Increased Amlodipine to 10mg. Follow-up in 4 weeks.", diagnosis: "Hypertension — uncontrolled", prescriptions: ["Amlodipine 10mg OD", "Low-salt diet advice"] },
  { id: "e2", patientId: "p1", facilityId: "f1", doctorId: "u3", type: "in_person", date: "2023-12-10", notes: "BP 150/95. Started Amlodipine 5mg. Lifestyle counseling given.", diagnosis: "Hypertension — newly diagnosed", prescriptions: ["Amlodipine 5mg OD"] },
  { id: "e3", patientId: "p2", facilityId: "f1", doctorId: "u3", type: "in_person", date: "2024-01-08", notes: "ANC visit 2. BP 118/76, Hb 10.2 g/dL. Iron+FA prescribed. USG advised.", diagnosis: "G2P1 at 28 weeks — routine ANC", prescriptions: ["Iron + Folic Acid 1 OD", "Calcium 500mg BD"] },
];

export const mockImmunizations = [
  { id: "i1", patientId: "p5", vaccine: "OPV", dose: "Booster 1", date: "2023-11-10", facility: "Bhimpur PHC", status: "given" },
  { id: "i2", patientId: "p5", vaccine: "DPT", dose: "3rd dose", date: "2023-10-15", facility: "Bhimpur PHC", status: "given" },
  { id: "i3", patientId: "p5", vaccine: "Measles", dose: "1st dose", date: "2023-12-20", facility: "Bhimpur PHC", status: "given" },
];

export const mockDashboardMetrics = {
  avgWaitTime: 23,
  queueLength: 8,
  teleconsultVolume: 12,
  referralCompletionRate: 68,
  followUpAdherence: 74,
  stockOutRate: 25,
  ancCoverage: 82,
  htnControlRate: 58,
  tbAdherence: 91,
  monthlyTrend: [
    { month: "Aug", teleconsults: 45, referrals: 12, followups: 89 },
    { month: "Sep", teleconsults: 52, referrals: 15, followups: 94 },
    { month: "Oct", teleconsults: 48, referrals: 11, followups: 87 },
    { month: "Nov", teleconsults: 61, referrals: 18, followups: 102 },
    { month: "Dec", teleconsults: 58, referrals: 16, followups: 98 },
    { month: "Jan", teleconsults: 42, referrals: 9, followups: 71 },
  ],
  facilityComparison: [
    { facility: "Bhimpur PHC", stockOut: 25, followUp: 74, referral: 68 },
    { facility: "Wardha RH", stockOut: 12, followUp: 88, referral: 81 },
    { facility: "Nagpur DH", stockOut: 5, followUp: 92, referral: 94 },
    { facility: "Pulgaon SC", stockOut: 40, followUp: 61, referral: 52 },
  ],
};

export const triageQuestions = [
  { id: "q1", question: "What is the main symptom?", questionHi: "मुख्य लक्षण क्या है?", options: ["Fever", "Chest pain", "Difficulty breathing", "Abdominal pain", "Headache", "Weakness", "Other"] },
  { id: "q2", question: "How long have you had this symptom?", questionHi: "यह लक्षण कब से है?", options: ["< 24 hours", "1–3 days", "4–7 days", "> 1 week"] },
  { id: "q3", question: "Severity (1–10)?", questionHi: "गंभीरता (1–10)?", options: ["1–3 (Mild)", "4–6 (Moderate)", "7–10 (Severe)"] },
];
