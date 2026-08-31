import React from "react";
import { AppProvider, useApp, roleNav } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SOSModal from "./components/SOSModal";
import AuthPage from "./pages/AuthPage";
import HealthWorkerDashboard from "./pages/HealthWorkerDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import TriagePage from "./pages/TriagePage";
import QueuePage from "./pages/QueuePage";
import TeleconsultPage from "./pages/TeleconsultPage";
import PatientRecordPage from "./pages/PatientRecordPage";
import ReferralPage from "./pages/ReferralPage";
import MedicinePage from "./pages/MedicinePage";
import FollowUpPage from "./pages/FollowUpPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import SettingsPage from "./pages/SettingsPage";

function DoctorDashboard() {
  const { setCurrentPage } = useApp();
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-stone-900">Good morning, Dr. Anjali Singh 👋</h1>
        <p className="text-stone-500 text-sm mt-0.5">Mon, 15 Jan 2024 · Bhimpur PHC</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Waiting Patients", value: 5, color: "border-amber-500" },
          { label: "In Consultation", value: 1, color: "border-green-500" },
          { label: "Teleconsults Done", value: 12, color: "border-teal-500" },
          { label: "Referrals Created", value: 3, color: "border-violet-500" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-xl p-4 border-l-4 ${s.color} shadow-sm`}>
            <div className="text-3xl font-heading font-bold text-stone-900">{s.value}</div>
            <div className="text-sm font-semibold text-stone-600 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "View Queue", icon: "🎟", page: "queue", bg: "bg-teal-600 hover:bg-teal-700" },
          { label: "Start Teleconsult", icon: "📹", page: "teleconsult", bg: "bg-violet-600 hover:bg-violet-700" },
          { label: "Patient Records", icon: "👤", page: "patients", bg: "bg-blue-600 hover:bg-blue-700" },
        ].map((a) => (
          <button key={a.label} onClick={() => setCurrentPage(a.page as any)} className={`${a.bg} text-white rounded-xl py-4 flex flex-col items-center gap-2 transition-colors`}>
            <span className="text-3xl">{a.icon}</span>
            <span className="text-sm font-semibold">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { setCurrentPage } = useApp();
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-stone-900">Facility Admin Dashboard</h1>
        <p className="text-stone-500 text-sm mt-0.5">Bhimpur PHC · Suresh Patil</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Analytics", icon: "📊", page: "analytics", bg: "bg-teal-600 hover:bg-teal-700" },
          { label: "Medicine Stock", icon: "💊", page: "medicines", bg: "bg-amber-600 hover:bg-amber-700" },
          { label: "Settings", icon: "⚙", page: "settings", bg: "bg-stone-700 hover:bg-stone-800" },
        ].map((a) => (
          <button key={a.label} onClick={() => setCurrentPage(a.page as any)} className={`${a.bg} text-white rounded-xl py-6 flex flex-col items-center gap-2 transition-colors`}>
            <span className="text-4xl">{a.icon}</span>
            <span className="text-sm font-semibold">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PageRouter() {
  const { currentUser, currentPage } = useApp();

  if (!currentUser) return null;

  const allowedPages = roleNav[currentUser.role];

  if (!allowedPages.includes(currentPage)) {
    return (
      <div className="p-8 text-center text-stone-400">
        <div className="text-4xl mb-3">🔒</div>
        <div className="font-semibold">Access denied for your role</div>
      </div>
    );
  }

  if (currentPage === "dashboard") {
    if (currentUser.role === "patient") return <PatientDashboard />;
    if (currentUser.role === "doctor") return <DoctorDashboard />;
    if (currentUser.role === "facility_admin") return <AdminDashboard />;
    if (currentUser.role === "super_admin") return <AnalyticsDashboard />;
    return <HealthWorkerDashboard />;
  }

  const pages: Record<string, React.ReactElement> = {
    triage: <TriagePage />,
    queue: <QueuePage />,
    teleconsult: <TeleconsultPage />,
    patients: <PatientRecordPage />,
    referrals: <ReferralPage />,
    medicines: <MedicinePage />,
    followups: <FollowUpPage />,
    analytics: <AnalyticsDashboard />,
    settings: <SettingsPage />,
  };

  return pages[currentPage] ?? null;
}

function AppShell() {
  const { currentUser } = useApp();

  if (!currentUser) return <AuthPage />;

  return (
    <div className="h-full flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-stone-50">
          <PageRouter />
        </main>
      </div>
      <SOSModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
