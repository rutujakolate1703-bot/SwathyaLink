import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockPatients, mockEncounters, mockDiagnostics, mockReferrals, mockImmunizations } from "../data/mock";

type Tab = "timeline" | "encounters" | "diagnostics" | "immunizations" | "consent";

export default function PatientRecordPage() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [tab, setTab] = useState<Tab>("timeline");
  const [fhirExported, setFhirExported] = useState(false);

  const patientEncounters = mockEncounters.filter((e) => e.patientId === selectedPatient.id);
  const patientDiagnostics = mockDiagnostics.filter((d) => d.patientId === selectedPatient.id);
  const patientReferrals = mockReferrals.filter((r) => r.patientId === selectedPatient.id);
  const patientImmunizations = mockImmunizations.filter((i) => i.patientId === selectedPatient.id);

  const tabs: { id: Tab; label: string }[] = [
    { id: "timeline", label: "Timeline" },
    { id: "encounters", label: "Encounters" },
    { id: "diagnostics", label: "Diagnostics" },
    { id: "immunizations", label: "Immunizations" },
    { id: "consent", label: "Consent Log" },
  ];

  const flagColors: Record<string, string> = {
    ANC: "bg-pink-100 text-pink-800", PNC: "bg-purple-100 text-purple-800",
    HTN: "bg-red-100 text-red-800", DM: "bg-amber-100 text-amber-800",
    TB: "bg-yellow-100 text-yellow-800", under5: "bg-blue-100 text-blue-800",
  };

  const age = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "मरीज़ का रिकॉर्ड" : "Longitudinal Patient Record"}</h1>
          <p className="text-stone-500 text-sm mt-0.5">ABDM linked · FHIR R4 compliant · Timeline view</p>
        </div>
      </div>

      {/* Patient list */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {mockPatients.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPatient(p)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-colors text-sm ${
              selectedPatient.id === p.id ? "border-teal-600 bg-teal-50" : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <span className="font-medium text-stone-900">{p.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Patient header */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-heading font-bold text-xl flex-shrink-0">
              {selectedPatient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-stone-900">{selectedPatient.name}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-stone-500">{selectedPatient.gender === "M" ? "Male" : "Female"} · {age(selectedPatient.dob)} yrs</span>
                <span className="text-sm text-stone-500">{selectedPatient.address}</span>
                <span className="font-mono text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{selectedPatient.abhaId}</span>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {selectedPatient.highRiskFlags.map((f) => (
                  <span key={f} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${flagColors[f] ?? "bg-stone-100 text-stone-700"}`}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setFhirExported(true)}
              className="border border-teal-600 text-teal-700 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-teal-50 transition-colors flex items-center gap-1.5"
            >
              📄 {fhirExported ? "FHIR Exported ✓" : "Export FHIR JSON"}
            </button>
            <button className="border border-stone-300 text-stone-600 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-stone-50 transition-colors">
              ↗ Create Referral
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-white text-teal-700 shadow-sm" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "timeline" && (
        <div className="relative space-y-4">
          <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-stone-200" />
          {[
            ...patientEncounters.map((e) => ({ type: "encounter", date: e.date, title: e.type === "teleconsult" ? "Teleconsultation" : "In-person visit", sub: e.diagnosis, icon: e.type === "teleconsult" ? "📹" : "🏥" })),
            ...patientReferrals.map((r) => ({ type: "referral", date: r.createdAt.split("T")[0], title: "Referral Created", sub: r.reason.slice(0, 60) + "…", icon: "↗" })),
            ...patientDiagnostics.map((d) => ({ type: "diagnostic", date: d.requestedAt.split("T")[0], title: d.testType, sub: `Status: ${d.status}`, icon: "🔬" })),
          ].sort((a, b) => b.date.localeCompare(a.date)).map((event, i) => (
            <div key={i} className="flex gap-4 relative pl-12">
              <div className="absolute left-3 w-5 h-5 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center text-xs z-10">
                {event.icon}
              </div>
              <div className="flex-1 bg-white rounded-xl border border-stone-200 p-3">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-stone-900 text-sm">{event.title}</div>
                  <span className="text-xs text-stone-400 font-mono">{event.date}</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">{event.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "encounters" && (
        <div className="space-y-3">
          {patientEncounters.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-400">No encounters recorded</div>
          ) : patientEncounters.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mr-2 ${e.type === "teleconsult" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"}`}>
                    {e.type === "teleconsult" ? "📹 Teleconsult" : "🏥 In-person"}
                  </span>
                  <span className="font-mono text-xs text-stone-400">{e.id}</span>
                </div>
                <span className="text-xs text-stone-400">{e.date}</span>
              </div>
              <div className="font-semibold text-stone-900 mb-1">{e.diagnosis}</div>
              <div className="text-sm text-stone-500 mb-2">{e.notes}</div>
              <div className="flex flex-wrap gap-1.5">
                {e.prescriptions.map((rx, i) => (
                  <span key={i} className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">💊 {rx}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "diagnostics" && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {patientDiagnostics.length === 0 ? (
            <div className="p-8 text-center text-stone-400">No diagnostics ordered</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left">
                  <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Test</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Facility</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Status</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">TAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {patientDiagnostics.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-3 font-semibold text-stone-900">🔬 {d.testType}</td>
                    <td className="px-4 py-3 text-stone-500">Bhimpur PHC</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${d.status === "completed" ? "bg-green-100 text-green-700" : d.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 font-mono text-xs">{d.tatHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "immunizations" && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {patientImmunizations.length === 0 ? (
            <div className="p-8 text-center text-stone-400">No immunization records</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {patientImmunizations.map((imm) => (
                <div key={imm.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900">{imm.vaccine} — {imm.dose}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{imm.facility} · {imm.date}</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Given</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "consent" && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wide">
            HIE-CM Consent Audit Log
          </div>
          <div className="divide-y divide-stone-100">
            {[
              { action: "Record Accessed", by: "Dr. Anjali Singh", time: "2024-01-10 10:23", purpose: "Treatment", status: "Consented" },
              { action: "FHIR Export", by: "Suresh Patil (Admin)", time: "2024-01-12 14:05", purpose: "QA Audit", status: "Consented" },
              { action: "Referral Shared", by: "Priya Devi (ASHA)", time: "2024-01-14 09:30", purpose: "Care Coordination", status: "Consented" },
            ].map((log, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-semibold text-stone-900">{log.action}</div>
                  <div className="text-xs text-stone-400 mt-0.5">By {log.by} · {log.purpose}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-stone-400">{log.time}</div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
