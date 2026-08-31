import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockUsers, Role } from "../data/mock";

const roles: { id: Role; label: string; labelHi: string; desc: string; icon: string; color: string }[] = [
  { id: "patient", label: "Patient", labelHi: "मरीज़", desc: "View your health records, tokens & referrals", icon: "👤", color: "border-blue-300 hover:border-blue-500 hover:bg-blue-50" },
  { id: "health_worker", label: "Health Worker (ASHA/ANM)", labelHi: "स्वास्थ्य कार्यकर्ता", desc: "Triage, follow-ups, referrals & medicine stock", icon: "🏥", color: "border-teal-300 hover:border-teal-500 hover:bg-teal-50" },
  { id: "doctor", label: "Doctor", labelHi: "डॉक्टर", desc: "View queue, conduct teleconsults & prescriptions", icon: "👨‍⚕️", color: "border-violet-300 hover:border-violet-500 hover:bg-violet-50" },
  { id: "facility_admin", label: "Facility Admin", labelHi: "सुविधा प्रशासक", desc: "Manage inventory, users & facility dashboards", icon: "🏢", color: "border-amber-300 hover:border-amber-500 hover:bg-amber-50" },
  { id: "super_admin", label: "Super Admin", labelHi: "सुपर एडमिन", desc: "Program-level analytics & ABDM settings", icon: "⚙️", color: "border-red-300 hover:border-red-500 hover:bg-red-50" },
];

export default function AuthPage() {
  const { setCurrentUser, language } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState<"role" | "abha" | "pin">("role");
  const [abhaInput, setAbhaInput] = useState("");
  const [pin, setPin] = useState("");
  const isHindi = language === "hi";

  const handleContinue = () => {
    if (!selectedRole) return;
    if (selectedRole === "patient") {
      setStep("abha");
    } else {
      setStep("pin");
    }
  };

  const handleLogin = () => {
    const user = mockUsers.find((u) => u.role === selectedRole);
    if (user) setCurrentUser({ ...user, language });
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-teal-900 via-teal-800 to-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4v24M4 16h24" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-1">RuralCare OS</h1>
          <p className="text-teal-200 text-sm">{isHindi ? "हर गांव के लिए एकीकृत स्वास्थ्य सेवा" : "Integrated care for every village"}</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs text-teal-300 font-mono bg-white/10 px-2 py-0.5 rounded">ABDM Ready</span>
            <span className="text-xs text-teal-300 font-mono bg-white/10 px-2 py-0.5 rounded">FHIR R4</span>
            <span className="text-xs text-teal-300 font-mono bg-white/10 px-2 py-0.5 rounded">Offline First</span>
            <span className="text-xs text-teal-300 font-mono bg-white/10 px-2 py-0.5 rounded">10 Languages</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {step === "role" && (
            <>
              <h2 className="text-lg font-heading font-semibold text-stone-900 mb-1">
                {isHindi ? "अपनी भूमिका चुनें" : "Select your role"}
              </h2>
              <p className="text-sm text-stone-500 mb-4">
                {isHindi ? "जारी रखने के लिए अपनी भूमिका चुनें" : "Choose your role to continue"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`border-2 rounded-xl p-3.5 text-left transition-all ${
                      selectedRole === r.id
                        ? "border-teal-600 bg-teal-50 ring-2 ring-teal-200"
                        : r.color
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">{isHindi ? r.labelHi : r.label}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{r.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className="w-full bg-teal-700 text-white rounded-xl py-3 font-semibold text-sm hover:bg-teal-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isHindi ? "जारी रखें" : "Continue"} →
              </button>
            </>
          )}

          {step === "abha" && (
            <>
              <button onClick={() => setStep("role")} className="text-teal-700 text-sm mb-4 flex items-center gap-1 hover:underline">
                ← Back
              </button>
              <h2 className="text-lg font-heading font-semibold text-stone-900 mb-1">
                {isHindi ? "ABHA आईडी दर्ज करें" : "Enter ABHA Health ID"}
              </h2>
              <p className="text-sm text-stone-500 mb-4">Your 14-digit Ayushman Bharat Health Account ID</p>
              <input
                type="text"
                placeholder="ABHA-XXXX-XXXX-XXXX"
                value={abhaInput}
                onChange={(e) => setAbhaInput(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm font-mono mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="text-xs text-stone-400 mb-4">Demo: try <span className="font-mono text-teal-700">ABHA-2345-6789-0123</span></div>
              <button
                onClick={() => setStep("pin")}
                className="w-full bg-teal-700 text-white rounded-xl py-3 font-semibold text-sm hover:bg-teal-800 transition-colors"
              >
                Verify ABHA →
              </button>
              <div className="text-center mt-3">
                <button className="text-xs text-teal-600 hover:underline">Create new ABHA ID</button>
              </div>
            </>
          )}

          {step === "pin" && (
            <>
              <button onClick={() => setStep(selectedRole === "patient" ? "abha" : "role")} className="text-teal-700 text-sm mb-4 flex items-center gap-1 hover:underline">
                ← Back
              </button>
              <h2 className="text-lg font-heading font-semibold text-stone-900 mb-1">
                {isHindi ? "पिन दर्ज करें" : "Enter PIN"}
              </h2>
              <p className="text-sm text-stone-500 mb-4">
                {selectedRole === "patient" ? "Logging in as " : "Staff login — "} {mockUsers.find((u) => u.role === selectedRole)?.name}
              </p>
              <div className="flex gap-3 justify-center mb-5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                      pin.length > i ? "border-teal-600 bg-teal-50" : "border-stone-300"
                    }`}
                  >
                    {pin.length > i ? "●" : ""}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (k === "⌫") setPin((p) => p.slice(0, -1));
                      else if (k !== "" && pin.length < 4) setPin((p) => p + k);
                    }}
                    className={`h-12 rounded-lg font-semibold text-lg transition-colors ${
                      k === "" ? "" : "bg-stone-100 hover:bg-stone-200 text-stone-900"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-400 text-center mb-4">Demo: use any 4-digit PIN</p>
              <button
                onClick={handleLogin}
                disabled={pin.length < 4}
                className="w-full bg-teal-700 text-white rounded-xl py-3 font-semibold text-sm hover:bg-teal-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isHindi ? "लॉगिन करें" : "Login"} →
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-teal-300/60 mt-4">
          Powered by NHM · ABDM compliant · Data encrypted at rest
        </p>
      </div>
    </div>
  );
}
