import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Role, t } from "../data/mock";

export type Page =
  | "dashboard"
  | "triage"
  | "queue"
  | "teleconsult"
  | "patients"
  | "referrals"
  | "medicines"
  | "followups"
  | "analytics"
  | "settings";

interface AppState {
  currentUser: User | null;
  currentPage: Page;
  language: string;
  voiceEnabled: boolean;
  isOnline: boolean;
  sosOpen: boolean;
  sidebarOpen: boolean;
  tr: (key: string) => string;
  setCurrentUser: (user: User | null) => void;
  setCurrentPage: (page: Page) => void;
  setLanguage: (lang: string) => void;
  toggleVoice: () => void;
  setSosOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [language, setLanguage] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sosOpen, setSosOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const tr = (key: string) => {
    const dict = t[language] ?? t["en"];
    return dict[key] ?? t["en"][key] ?? key;
  };

  const toggleVoice = () => setVoiceEnabled((v) => !v);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentPage,
        language,
        voiceEnabled,
        isOnline,
        sosOpen,
        sidebarOpen,
        tr,
        setCurrentUser,
        setCurrentPage,
        setLanguage,
        toggleVoice,
        setSosOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const roleNav: Record<Role, Page[]> = {
  patient: ["dashboard", "triage", "referrals"],
  health_worker: ["dashboard", "triage", "queue", "patients", "referrals", "medicines", "followups"],
  doctor: ["dashboard", "queue", "teleconsult", "patients", "referrals"],
  facility_admin: ["dashboard", "medicines", "analytics", "settings"],
  super_admin: ["analytics", "settings"],
};

export const pageLabels: Record<Page, { icon: string; label: string }> = {
  dashboard: { icon: "⊞", label: "dashboard" },
  triage: { icon: "🩺", label: "triage" },
  queue: { icon: "🎟", label: "queue" },
  teleconsult: { icon: "📹", label: "teleconsult" },
  patients: { icon: "👤", label: "patients" },
  referrals: { icon: "↗", label: "referrals" },
  medicines: { icon: "💊", label: "medicines" },
  followups: { icon: "📋", label: "followups" },
  analytics: { icon: "📊", label: "analytics" },
  settings: { icon: "⚙", label: "settings" },
};
