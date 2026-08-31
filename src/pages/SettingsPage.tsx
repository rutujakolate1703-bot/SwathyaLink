import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SettingsPage() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [abdmUrl, setAbdmUrl] = useState("https://dev.abdm.gov.in/gateway");
  const [fhirUrl, setFhirUrl] = useState("https://fhir.abdm.gov.in/r4");
  const [uhiUrl, setUhiUrl] = useState("https://uhi.abdm.gov.in/v2");
  const [saved, setSaved] = useState(false);
  const [features, setFeatures] = useState({
    voiceTriage: true,
    abhaVerification: true,
    fhirExport: true,
    offlineSync: true,
    sosAlert: true,
    uhiBooking: false,
    teleICU: false,
    ePharmacy: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleFeature = (key: string) => {
    setFeatures((f) => ({ ...f, [key]: !f[key as keyof typeof f] }));
  };

  const Toggle = ({ featureKey, label, desc }: { featureKey: string; label: string; desc: string }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-stone-100 last:border-0">
      <div>
        <div className="font-semibold text-stone-900 text-sm">{label}</div>
        <div className="text-xs text-stone-500 mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => toggleFeature(featureKey)}
        className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors ${features[featureKey as keyof typeof features] ? "bg-teal-600" : "bg-stone-300"}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${features[featureKey as keyof typeof features] ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "सेटिंग्स" : "Settings & Configuration"}</h1>
        <p className="text-stone-500 text-sm mt-0.5">ABDM integration · Feature flags · System configuration</p>
      </div>

      {/* ABDM API Endpoints */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#0f766e" strokeWidth="2" /></svg>
          </div>
          <div>
            <h2 className="font-heading font-semibold text-stone-900">ABDM API Configuration</h2>
            <p className="text-xs text-stone-500">Ayushman Bharat Digital Mission integration endpoints</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "ABDM Gateway URL", value: abdmUrl, onChange: setAbdmUrl, hint: "NHA ABDM sandbox/production" },
            { label: "FHIR R4 Base URL", value: fhirUrl, onChange: setFhirUrl, hint: "FHIR server for patient records" },
            { label: "UHI Endpoint", value: uhiUrl, onChange: setUhiUrl, hint: "Unified Health Interface for booking" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs font-semibold text-stone-500 block mb-1">{field.label}</label>
              <input
                type="url"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-stone-400 mt-0.5">{field.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          <strong>Note:</strong> Currently using sandbox/mock APIs. Switch to production endpoints after NHA registration and ABDM approval. ABHA verification and consent flows will activate automatically.
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: "ABHA", status: "Mock" },
            { name: "HPR/HFR", status: "Mock" },
            { name: "HIE-CM", status: "Mock" },
            { name: "FHIR R4", status: "Ready" },
          ].map((api) => (
            <div key={api.name} className="bg-stone-50 rounded-lg p-2.5 text-center">
              <div className="text-xs font-mono font-semibold text-stone-700">{api.name}</div>
              <div className={`text-xs mt-0.5 font-semibold ${api.status === "Ready" ? "text-green-600" : "text-amber-600"}`}>{api.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Flags */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h2 className="font-heading font-semibold text-stone-900 mb-4">Feature Flags</h2>
        <Toggle featureKey="voiceTriage" label="Voice Triage & Navigation" desc="Enable browser speech recognition for triage and voice commands" />
        <Toggle featureKey="abhaVerification" label="ABHA ID Verification" desc="Verify ABHA IDs via ABDM API before registration" />
        <Toggle featureKey="fhirExport" label="FHIR R4 Export" desc="Allow export of patient records as FHIR JSON bundles" />
        <Toggle featureKey="offlineSync" label="Offline-First Sync" desc="Queue data locally when offline and sync when connection restored" />
        <Toggle featureKey="sosAlert" label="SOS Emergency Alert" desc="One-tap SOS with location sharing and pre-filled clinical summary" />
        <Toggle featureKey="uhiBooking" label="UHI Appointment Booking" desc="Unified Health Interface booking across networked facilities" />
        <Toggle featureKey="teleICU" label="Tele-ICU Module" desc="High-acuity remote monitoring for ICU patients (coming soon)" />
        <Toggle featureKey="ePharmacy" label="e-Pharmacy Integration" desc="Order medicines from approved Jan Aushadhi pharmacies" />
      </div>

      {/* Security & Privacy */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h2 className="font-heading font-semibold text-stone-900 mb-4">Security & Privacy</h2>
        <div className="space-y-2">
          {[
            { label: "Role-Based Access Control (RBAC)", status: "Active", color: "text-green-700 bg-green-100" },
            { label: "Audit Logging", status: "Active", color: "text-green-700 bg-green-100" },
            { label: "Consent Capture (HIE-CM)", status: "Mock", color: "text-amber-700 bg-amber-100" },
            { label: "Encryption at Rest (DB level)", status: "Enabled", color: "text-green-700 bg-green-100" },
            { label: "HTTPS / TLS 1.3", status: "Enforced", color: "text-green-700 bg-green-100" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-sm text-stone-700">{item.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.color}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Facility config */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h2 className="font-heading font-semibold text-stone-900 mb-4">Facility Configuration</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Facility Code", value: "MH-WARD-PHC-001" },
            { label: "HFR ID", value: "IN3210000123" },
            { label: "Block", value: "Wardha" },
            { label: "District", value: "Wardha, Maharashtra" },
          ].map((item) => (
            <div key={item.label} className="bg-stone-50 rounded-lg p-3">
              <div className="text-xs text-stone-500 font-semibold">{item.label}</div>
              <div className="text-sm font-mono font-semibold text-stone-900 mt-0.5">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-teal-700 text-white rounded-xl py-3 font-semibold text-sm hover:bg-teal-800 transition-colors"
      >
        {saved ? "✓ Settings Saved" : "Save Settings"}
      </button>
    </div>
  );
}
