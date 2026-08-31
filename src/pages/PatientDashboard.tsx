import { useApp } from "../context/AppContext";
import { mockTokens, mockReferrals, mockFollowUps, mockEncounters } from "../data/mock";

export default function PatientDashboard() {
  const { currentUser, setSosOpen, setCurrentPage } = useApp();
  const myToken = mockTokens.find((t) => t.patientId === "p1");
  const myReferrals = mockReferrals.filter((r) => r.patientId === "p1");
  const myFollowUps = mockFollowUps.filter((f) => f.patientId === "p1");
  const myEncounters = mockEncounters.filter((e) => e.patientId === "p1");

  const statusColors: Record<string, string> = {
    initiated: "bg-blue-100 text-blue-800",
    accepted: "bg-teal-100 text-teal-800",
    completed: "bg-green-100 text-green-800",
    no_show: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Greeting + ABHA */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-teal-200 text-sm">Welcome back</p>
            <h1 className="text-2xl font-heading font-bold mt-0.5">{currentUser?.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">ABHA-2345-6789-0123</span>
              <span className="text-xs bg-green-400/30 text-green-200 px-2 py-0.5 rounded-full font-semibold">● Verified</span>
            </div>
          </div>
          <button
            onClick={() => setSosOpen(true)}
            className="bg-red-500 hover:bg-red-600 transition-colors text-white rounded-xl px-4 py-2.5 font-bold text-sm flex items-center gap-1.5"
          >
            🆘 <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Current Token */}
      {myToken && (
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-stone-900">Current Token</h2>
            <button onClick={() => setCurrentPage("queue")} className="text-xs text-teal-700 font-semibold hover:underline">Queue status →</button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-heading font-bold text-teal-700">{myToken.tokenNumber}</div>
              <div className={`text-xs mt-1 font-semibold px-2 py-0.5 rounded-full ${myToken.status === "waiting" ? "bg-amber-100 text-amber-700" : myToken.status === "in_progress" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"}`}>
                {myToken.status === "waiting" ? "Waiting" : myToken.status === "in_progress" ? "In Consultation" : "Completed"}
              </div>
            </div>
            {/* QR mock */}
            <div className="w-16 h-16 bg-stone-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-white" : "bg-stone-900"}`} />
                ))}
              </div>
            </div>
            <div className="text-sm text-stone-500 space-y-1 flex-1">
              <div>Dr. Anjali Singh</div>
              <div className="text-xs text-stone-400">~{3 * (mockTokens.filter((t) => t.status === "waiting" && t.tokenNumber < myToken.tokenNumber).length + 1)} min wait</div>
              <div className="text-xs font-mono text-stone-400">QR-{myToken.tokenNumber.replace("-", "")}-f1-20240115</div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-ups */}
      {myFollowUps.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100">
            <h2 className="font-heading font-semibold text-stone-900">Upcoming Follow-ups</h2>
          </div>
          {myFollowUps.map((f) => (
            <div key={f.id} className={`px-4 py-3 border-l-4 ${f.status === "overdue" ? "border-l-red-500 bg-red-50" : "border-l-teal-500"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-sm text-stone-900">{f.type} Check</div>
                  <div className="text-xs text-stone-500 mt-0.5">{f.notes}</div>
                </div>
                <span className={`text-xs font-bold ${f.status === "overdue" ? "text-red-600" : "text-teal-600"}`}>
                  {f.status === "overdue" ? "OVERDUE" : f.dueDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Referrals */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-stone-900">Active Referrals</h2>
          <button onClick={() => setCurrentPage("referrals")} className="text-xs text-teal-700 font-semibold hover:underline">View all →</button>
        </div>
        {myReferrals.length === 0 ? (
          <div className="p-6 text-center text-stone-400 text-sm">No active referrals</div>
        ) : (
          myReferrals.map((r) => (
            <div key={r.id} className="px-4 py-3 border-b border-stone-100 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-sm text-stone-900">{r.reason.slice(0, 50)}…</div>
                  <div className="text-xs text-stone-400 mt-0.5">→ Wardha Rural Hospital</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[r.status] ?? "bg-stone-100 text-stone-600"}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Health summary */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-stone-900">Health Summary</h2>
          <button onClick={() => setCurrentPage("patients")} className="text-xs text-teal-700 font-semibold hover:underline">Full record →</button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-500 font-semibold uppercase tracking-wide">Conditions</div>
            <div className="text-sm font-semibold text-stone-900 mt-1">Hypertension (HTN)</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-500 font-semibold uppercase tracking-wide">Current Meds</div>
            <div className="text-sm font-semibold text-stone-900 mt-1">Amlodipine 10mg</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-500 font-semibold uppercase tracking-wide">Last Visit</div>
            <div className="text-sm font-semibold text-stone-900 mt-1">10 Jan 2024</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3">
            <div className="text-xs text-stone-500 font-semibold uppercase tracking-wide">Blood Pressure</div>
            <div className="text-sm font-semibold text-red-700 mt-1">160/100 mmHg</div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button className="w-full border border-teal-600 text-teal-700 rounded-lg py-2 text-sm font-semibold hover:bg-teal-50 transition-colors">
            📄 Export FHIR Record (JSON)
          </button>
        </div>
      </div>
    </div>
  );
}
