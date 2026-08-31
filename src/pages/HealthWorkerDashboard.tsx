import { useApp } from "../context/AppContext";
import { mockFollowUps, mockTokens, mockMedicineStock, mockPatients } from "../data/mock";

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`bg-white rounded-xl p-4 border-l-4 ${color} shadow-sm`}>
      <div className="text-2xl font-heading font-bold text-stone-900">{value}</div>
      <div className="text-sm font-semibold text-stone-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-stone-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function HealthWorkerDashboard() {
  const { currentUser, tr, setCurrentPage } = useApp();
  const dueTasks = mockFollowUps.filter((f) => f.status === "due" || f.status === "overdue");
  const overdueCount = mockFollowUps.filter((f) => f.status === "overdue").length;
  const stockOuts = mockMedicineStock.filter((m) => m.status === "out").length;
  const waitingQueue = mockTokens.filter((t) => t.status === "waiting").length;
  const highRisk = mockPatients.filter((p) => p.highRiskFlags.length > 0);

  const flagColors: Record<string, string> = {
    ANC: "bg-pink-100 text-pink-800",
    PNC: "bg-purple-100 text-purple-800",
    NCD: "bg-orange-100 text-orange-800",
    HTN: "bg-red-100 text-red-800",
    DM: "bg-amber-100 text-amber-800",
    TB: "bg-yellow-100 text-yellow-800",
    under5: "bg-blue-100 text-blue-800",
  };

  const taskStatusColors: Record<string, string> = {
    overdue: "border-l-red-500 bg-red-50",
    due: "border-l-amber-500 bg-amber-50",
    upcoming: "border-l-teal-400 bg-white",
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-stone-900">
          {tr("goodMorning")}, {currentUser?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">Mon, 15 Jan 2024 · Bhimpur PHC</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Patients in Queue" value={waitingQueue} sub="Today's queue" color="border-teal-500" />
        <StatCard label="Pending Tasks" value={dueTasks.length} sub={`${overdueCount} overdue`} color="border-red-500" />
        <StatCard label="Stock-outs" value={stockOuts} sub="Essential medicines" color="border-amber-500" />
        <StatCard label="Teleconsults Done" value={12} sub="Today" color="border-violet-500" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: tr("newPatient"), icon: "👤", page: "patients", bg: "bg-teal-600 hover:bg-teal-700" },
            { label: tr("generateToken"), icon: "🎟", page: "queue", bg: "bg-orange-600 hover:bg-orange-700" },
            { label: tr("triage"), icon: "🩺", page: "triage", bg: "bg-violet-600 hover:bg-violet-700" },
            { label: tr("createReferral"), icon: "↗", page: "referrals", bg: "bg-blue-600 hover:bg-blue-700" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => setCurrentPage(a.page as any)}
              className={`${a.bg} text-white rounded-xl py-3 px-4 flex flex-col items-center gap-2 transition-colors`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-stone-900">{tr("todayTasks")}</h2>
            <button onClick={() => setCurrentPage("followups")} className="text-xs text-teal-700 hover:underline font-semibold">
              View all →
            </button>
          </div>
          <div className="divide-y divide-stone-100">
            {mockFollowUps.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className={`px-4 py-3 border-l-4 ${taskStatusColors[task.status] ?? "border-l-stone-200"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">{task.patientName}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{task.notes}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        task.type === "ANC" ? "bg-pink-100 text-pink-700"
                          : task.type === "PNC" ? "bg-purple-100 text-purple-700"
                          : task.type === "NCD" ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {task.type}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        task.status === "overdue" ? "text-red-600" : task.status === "due" ? "text-amber-600" : "text-teal-600"
                      }`}
                    >
                      {task.status === "overdue" ? "OVERDUE" : task.status === "due" ? "DUE TODAY" : task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Patients */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-stone-900">{tr("highRiskPatients")}</h2>
            <button onClick={() => setCurrentPage("patients")} className="text-xs text-teal-700 hover:underline font-semibold">
              View all →
            </button>
          </div>
          <div className="divide-y divide-stone-100">
            {highRisk.map((patient) => (
              <div key={patient.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-semibold text-sm flex-shrink-0">
                    {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">{patient.name}</div>
                    <div className="text-xs text-stone-400 font-mono">{patient.abhaId}</div>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {patient.highRiskFlags.map((f) => (
                    <span key={f} className={`text-xs px-1.5 py-0.5 rounded font-semibold ${flagColors[f] ?? "bg-stone-100 text-stone-700"}`}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medicine Stock Alerts */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-stone-900">{tr("medicineAlerts")}</h2>
          <button onClick={() => setCurrentPage("medicines")} className="text-xs text-teal-700 hover:underline font-semibold">
            View inventory →
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {mockMedicineStock.filter((m) => m.status !== "in_stock").map((med) => (
            <div
              key={med.id}
              className={`rounded-lg px-3 py-2 border ${
                med.status === "out" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className={`text-xs font-bold ${med.status === "out" ? "text-red-700" : "text-amber-700"}`}>
                {med.status === "out" ? "OUT OF STOCK" : "LOW STOCK"}
              </div>
              <div className="text-sm font-semibold text-stone-900 mt-0.5">{med.medicineName}</div>
              <div className="text-xs text-stone-500">{med.quantity} {med.unit} remaining</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
