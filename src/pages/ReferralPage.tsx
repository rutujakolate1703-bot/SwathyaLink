import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockReferrals, mockDiagnostics, mockFacilities, mockPatients } from "../data/mock";

type ReferralStatus = "initiated" | "accepted" | "completed" | "no_show";

export default function ReferralPage() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [referrals, setReferrals] = useState(mockReferrals);
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [form, setForm] = useState({ patientId: "p1", toFacilityId: "f2", reason: "", urgency: "routine" });

  const filtered = filter === "all" ? referrals : referrals.filter((r) => r.status === filter);

  const handleCreate = () => {
    const patient = mockPatients.find((p) => p.id === form.patientId);
    const newRef = {
      id: `r${referrals.length + 1}`,
      patientId: form.patientId,
      patientName: patient?.name ?? "Unknown",
      fromFacilityId: "f1",
      toFacilityId: form.toFacilityId,
      reason: form.reason,
      urgency: form.urgency,
      status: "initiated",
      createdAt: new Date().toISOString(),
    };
    setReferrals((prev) => [newRef, ...prev]);
    setShowNew(false);
    setForm({ patientId: "p1", toFacilityId: "f2", reason: "", urgency: "routine" });
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    initiated: { label: "Initiated", color: "text-blue-700", bg: "bg-blue-100" },
    accepted: { label: "Accepted", color: "text-teal-700", bg: "bg-teal-100" },
    completed: { label: "Completed", color: "text-green-700", bg: "bg-green-100" },
    no_show: { label: "No Show", color: "text-red-700", bg: "bg-red-100" },
  };

  const urgencyConfig: Record<string, { color: string }> = {
    routine: { color: "text-stone-600" },
    urgent: { color: "text-amber-700" },
    emergency: { color: "text-red-700" },
  };

  const facilityName = (id: string) => mockFacilities.find((f) => f.id === id)?.name ?? id;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "रेफरल और डायग्नोस्टिक्स" : "Referral & Diagnostic Coordination"}</h1>
          <p className="text-stone-500 text-sm mt-0.5">End-to-end tracking · FHIR ReferralRequest</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-teal-700 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-teal-800 transition-colors flex-shrink-0"
        >
          + {isHindi ? "रेफरल बनाएं" : "New Referral"}
        </button>
      </div>

      {/* Referral stats */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? "all" : key)}
            className={`rounded-xl p-3 text-center border-2 transition-colors ${filter === key ? `border-current ${cfg.bg}` : "border-stone-200 bg-white hover:border-stone-300"}`}
          >
            <div className={`text-2xl font-heading font-bold ${cfg.color}`}>
              {referrals.filter((r) => r.status === key).length}
            </div>
            <div className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</div>
          </button>
        ))}
      </div>

      {/* Referrals table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-stone-900">Referrals</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border border-stone-200 rounded-lg px-2 py-1 text-stone-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All statuses</option>
            {Object.keys(statusConfig).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="divide-y divide-stone-100">
          {filtered.map((r) => {
            const cfg = statusConfig[r.status as ReferralStatus];
            const urg = urgencyConfig[r.urgency];
            return (
              <div key={r.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-semibold text-stone-900">{r.patientName}</div>
                    <div className="text-sm text-stone-500 mt-0.5">{r.reason.slice(0, 80)}{r.reason.length > 80 ? "…" : ""}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    <span className={`text-xs font-bold uppercase ${urg.color}`}>{r.urgency}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-400">
                  <span>From: <span className="text-stone-600">{facilityName(r.fromFacilityId)}</span></span>
                  <span>→</span>
                  <span>To: <span className="text-stone-600">{facilityName(r.toFacilityId)}</span></span>
                  <span className="font-mono ml-auto">{r.createdAt.split("T")[0]}</span>
                </div>
                {/* Progress tracker */}
                <div className="flex items-center gap-1 mt-3">
                  {["initiated", "accepted", "completed"].map((s, i) => {
                    const statuses = ["initiated", "accepted", "completed", "no_show"];
                    const currentIdx = statuses.indexOf(r.status);
                    const stepIdx = statuses.indexOf(s);
                    const done = currentIdx >= stepIdx && r.status !== "no_show";
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${done ? "bg-teal-600" : "bg-stone-200"}`} />
                        {i < 2 && <div className={`flex-1 h-0.5 ${done && currentIdx > stepIdx ? "bg-teal-600" : "bg-stone-200"}`} />}
                        <span className={`text-xs ml-1 ${done ? "text-teal-600" : "text-stone-400"} hidden sm:inline`}>{s}</span>
                      </div>
                    );
                  })}
                  {r.status === "no_show" && (
                    <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic requests */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h2 className="font-heading font-semibold text-stone-900">Diagnostic Requests</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-left">
              <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Patient</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Test</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Status</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">TAT</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {mockDiagnostics.map((d) => (
              <tr key={d.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-semibold text-stone-900">{d.patientName}</td>
                <td className="px-4 py-3 text-stone-700">🔬 {d.testType}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${d.status === "completed" ? "bg-green-100 text-green-700" : d.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-stone-500">{d.tatHours}h</td>
                <td className="px-4 py-3 font-mono text-xs text-stone-400">{d.requestedAt.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Referral Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-heading font-semibold mb-4">Create Referral</h2>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-stone-500 block mb-1">Patient</label>
                <select value={form.patientId} onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {mockPatients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 block mb-1">Refer to Facility</label>
                <select value={form.toFacilityId} onChange={(e) => setForm((f) => ({ ...f, toFacilityId: e.target.value }))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {mockFacilities.filter((f) => f.id !== "f1").map((f) => <option key={f.id} value={f.id}>{f.name} — {f.type}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 block mb-1">Urgency</label>
                <div className="flex gap-2">
                  {["routine", "urgent", "emergency"].map((u) => (
                    <button key={u} onClick={() => setForm((f) => ({ ...f, urgency: u }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-colors capitalize ${form.urgency === u ? (u === "emergency" ? "border-red-600 bg-red-50 text-red-700" : u === "urgent" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-teal-600 bg-teal-50 text-teal-700") : "border-stone-200 text-stone-600"}`}
                    >{u}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 block mb-1">Reason / Clinical Summary</label>
                <textarea className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" rows={3} placeholder="Reason for referral..." value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 border border-stone-300 rounded-xl py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!form.reason} className="flex-1 bg-teal-700 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-teal-800 transition-colors disabled:opacity-40">Create Referral</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
