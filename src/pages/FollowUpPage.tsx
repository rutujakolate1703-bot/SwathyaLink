import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockFollowUps } from "../data/mock";

type Registry = "all" | "ANC" | "PNC" | "NCD" | "under5";

export default function FollowUpPage() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [tasks, setTasks] = useState(mockFollowUps);
  const [registry, setRegistry] = useState<Registry>("all");
  const [markingId, setMarkingId] = useState<string | null>(null);

  const filtered = registry === "all" ? tasks : tasks.filter((t) => t.type === registry);

  const markDone = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "completed" } : t));
    setMarkingId(null);
  };

  const statusColors: Record<string, string> = {
    overdue: "border-l-red-500 bg-red-50",
    due: "border-l-amber-500 bg-amber-50",
    upcoming: "border-l-teal-400 bg-white",
    completed: "border-l-green-400 bg-green-50 opacity-60",
  };

  const typeColors: Record<string, string> = {
    ANC: "bg-pink-100 text-pink-800",
    PNC: "bg-purple-100 text-purple-800",
    NCD: "bg-orange-100 text-orange-800",
    under5: "bg-blue-100 text-blue-800",
  };

  const registries: { id: Registry; label: string; labelHi: string; icon: string }[] = [
    { id: "all", label: "All Registries", labelHi: "सभी रजिस्ट्री", icon: "📋" },
    { id: "ANC", label: "ANC (Antenatal)", labelHi: "प्रसव पूर्व", icon: "🤰" },
    { id: "PNC", label: "PNC (Postnatal)", labelHi: "प्रसव के बाद", icon: "👶" },
    { id: "NCD", label: "NCD (Chronic)", labelHi: "दीर्घकालिक रोग", icon: "❤️" },
    { id: "under5", label: "Under-5 Child", labelHi: "5 साल से कम", icon: "🧒" },
  ];

  const overdueCount = tasks.filter((t) => t.status === "overdue").length;
  const dueCount = tasks.filter((t) => t.status === "due").length;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "फॉलो-अप और रजिस्ट्री" : "High-Risk Follow-Up & Registries"}</h1>
        <p className="text-stone-500 text-sm mt-0.5">ANC · PNC · NCD · Under-5 · FHIR CarePlan</p>
      </div>

      {/* Urgent alerts */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <div className="font-semibold text-red-800">{overdueCount} overdue visit{overdueCount !== 1 ? "s" : ""} — action needed</div>
            <div className="text-sm text-red-600 mt-0.5">
              Kamla Yadav (TB DOTS) and Ramesh Kumar (HTN) have missed scheduled visits. Call or visit immediately.
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Overdue", value: overdueCount, color: "text-red-700 bg-red-50 border-red-200" },
          { label: "Due Today", value: dueCount, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "Upcoming", value: tasks.filter((t) => t.status === "upcoming").length, color: "text-teal-700 bg-teal-50 border-teal-200" },
          { label: "Completed", value: tasks.filter((t) => t.status === "completed").length, color: "text-green-700 bg-green-50 border-green-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center border ${s.color}`}>
            <div className={`text-2xl font-heading font-bold ${s.color.split(" ")[0]}`}>{s.value}</div>
            <div className={`text-xs font-semibold ${s.color.split(" ")[0]} mt-0.5`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Registry filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {registries.map((r) => (
          <button
            key={r.id}
            onClick={() => setRegistry(r.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-colors ${
              registry === r.id ? "border-teal-600 bg-teal-50 text-teal-800" : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            }`}
          >
            <span>{r.icon}</span>
            <span>{isHindi ? r.labelHi : r.label}</span>
            <span className="ml-1 text-xs font-mono text-stone-400">
              {r.id === "all" ? tasks.length : tasks.filter((t) => t.type === r.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Task cards */}
      <div className="space-y-2">
        {filtered.map((task) => (
          <div
            key={task.id}
            className={`border-l-4 rounded-xl border border-stone-200 p-4 transition-all ${statusColors[task.status] ?? "bg-white"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-semibold text-sm flex-shrink-0">
                  {task.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-stone-900">{task.patientName}</div>
                  <div className="text-sm text-stone-500 mt-0.5">{task.notes}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColors[task.type] ?? "bg-stone-100 text-stone-600"}`}>
                      {task.type}
                    </span>
                    <span className={`text-xs font-bold ${task.status === "overdue" ? "text-red-600" : task.status === "due" ? "text-amber-600" : task.status === "completed" ? "text-green-600" : "text-teal-600"}`}>
                      {task.status === "overdue" ? "⚠ OVERDUE" : task.status === "due" ? "TODAY" : task.status === "completed" ? "✓ Done" : task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {task.status !== "completed" && (
                  <>
                    <button
                      onClick={() => setMarkingId(task.id)}
                      className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                    >
                      ✓ Mark Done
                    </button>
                    <button className="text-xs border border-stone-300 text-stone-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
                      📞 Call
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Care plan details */}
            <div className="mt-3 pt-3 border-t border-stone-200/60 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {task.type === "ANC" && (
                <>
                  <div className="text-xs"><span className="text-stone-400">Gestational age:</span> <span className="font-semibold text-stone-700">28 weeks</span></div>
                  <div className="text-xs"><span className="text-stone-400">Last BP:</span> <span className="font-semibold text-stone-700">118/76</span></div>
                  <div className="text-xs"><span className="text-stone-400">Hb:</span> <span className="font-semibold text-amber-700">10.2 g/dL (low)</span></div>
                </>
              )}
              {task.type === "NCD" && (
                <>
                  <div className="text-xs"><span className="text-stone-400">Condition:</span> <span className="font-semibold text-stone-700">{task.patientName.includes("Kamla") ? "TB" : task.patientName.includes("Mohan") ? "DM + HTN" : "HTN"}</span></div>
                  <div className="text-xs"><span className="text-stone-400">Last visit:</span> <span className="font-semibold text-stone-700">{task.status === "overdue" ? "Missed" : "On track"}</span></div>
                </>
              )}
              {task.type === "under5" && (
                <>
                  <div className="text-xs"><span className="text-stone-400">Age:</span> <span className="font-semibold text-stone-700">1 yr 8 mo</span></div>
                  <div className="text-xs"><span className="text-stone-400">Next vaccine:</span> <span className="font-semibold text-teal-700">OPV Booster</span></div>
                </>
              )}
              <div className="text-xs col-span-full sm:col-span-1"><span className="text-stone-400">Assigned:</span> <span className="font-semibold text-stone-700">Priya Devi (ASHA)</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm mark done modal */}
      {markingId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="font-heading font-semibold text-stone-900 mb-1">Mark Visit Complete?</h3>
            <p className="text-sm text-stone-500 mb-5">This will update the patient record and schedule the next follow-up.</p>
            <div className="flex gap-3">
              <button onClick={() => setMarkingId(null)} className="flex-1 border border-stone-300 rounded-xl py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50">Cancel</button>
              <button onClick={() => markDone(markingId)} className="flex-1 bg-teal-700 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-teal-800">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
