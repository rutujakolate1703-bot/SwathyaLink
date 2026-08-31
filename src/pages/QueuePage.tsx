import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockTokens, mockPatients } from "../data/mock";

export default function QueuePage() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [tokens, setTokens] = useState(mockTokens);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAbha, setNewAbha] = useState("");
  const [newToken, setNewToken] = useState<typeof mockTokens[0] | null>(null);

  const waiting = tokens.filter((t) => t.status === "waiting");
  const inProgress = tokens.filter((t) => t.status === "in_progress");
  const completed = tokens.filter((t) => t.status === "completed");

  const handleGenerate = () => {
    const num = `B-00${tokens.length + 1}`;
    const token = {
      id: `t${tokens.length + 1}`,
      patientId: "p_new",
      patientName: newName || "Walk-in Patient",
      facilityId: "f1",
      doctorId: "u3",
      tokenNumber: num,
      status: "waiting",
      createdAt: new Date().toISOString(),
    };
    setTokens((prev) => [...prev, token]);
    setNewToken(token as any);
    setShowNew(false);
    setNewName("");
    setNewAbha("");
  };

  const callNext = () => {
    setTokens((prev) => {
      const firstWaiting = prev.find((t) => t.status === "waiting");
      if (!firstWaiting) return prev;
      return prev.map((t) => {
        if (t.status === "in_progress") return { ...t, status: "completed" };
        if (t.id === firstWaiting.id) return { ...t, status: "in_progress" };
        return t;
      });
    });
    setNewToken(null);
  };

  const statusBg: Record<string, string> = {
    waiting: "bg-amber-50 border-amber-200 text-amber-800",
    in_progress: "bg-green-50 border-green-300 text-green-800",
    completed: "bg-stone-50 border-stone-200 text-stone-500",
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "कतार और टोकन" : "Queue & Tokens"}</h1>
          <p className="text-stone-500 text-sm mt-0.5">Bhimpur PHC · Dr. Anjali Singh · Mon 15 Jan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNew(true)}
            className="bg-teal-700 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-teal-800 transition-colors"
          >
            + {isHindi ? "टोकन बनाएं" : "New Token"}
          </button>
          <button
            onClick={callNext}
            className="bg-orange-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            ▶ {isHindi ? "अगला बुलाएं" : "Call Next"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: isHindi ? "प्रतीक्षा में" : "Waiting", value: waiting.length, color: "text-amber-700 bg-amber-50" },
          { label: isHindi ? "परामर्श में" : "In Consult", value: inProgress.length, color: "text-green-700 bg-green-50" },
          { label: isHindi ? "पूर्ण" : "Completed", value: completed.length, color: "text-stone-600 bg-stone-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-3xl font-heading font-bold">{s.value}</div>
            <div className="text-xs font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* New Token Generated */}
      {newToken && (
        <div className="bg-teal-700 text-white rounded-2xl p-5 flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-teal-200 font-semibold mb-1">NEW TOKEN</div>
            <div className="text-5xl font-heading font-bold">{newToken.tokenNumber}</div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">{newToken.patientName}</div>
            <div className="text-teal-200 text-sm mt-0.5">Bhimpur PHC · Dr. Anjali Singh</div>
            <div className="mt-2 font-mono text-xs text-teal-300">Est. wait: ~{waiting.length * 12} min</div>
          </div>
          {/* QR */}
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="grid grid-cols-5 gap-px">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 ${[0,2,4,6,8,10,14,16,18,20,22,24].includes(i) ? "bg-stone-900" : "bg-white"}`} />
              ))}
            </div>
          </div>
          <button
            onClick={() => setNewToken(null)}
            className="text-teal-200 hover:text-white text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Queue Board */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
          <h2 className="font-heading font-semibold text-stone-900">Live Queue Board</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {tokens.map((token, idx) => (
            <div key={token.id} className={`px-4 py-3 flex items-center gap-4 ${token.status === "completed" ? "opacity-50" : ""}`}>
              <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-heading font-bold text-lg flex-shrink-0 ${statusBg[token.status] ?? ""}`}>
                {token.tokenNumber.split("-")[1]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-stone-900">{token.patientName}</div>
                <div className="text-xs text-stone-400 mt-0.5 font-mono">
                  {new Date(token.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {token.status === "waiting" && (
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    #{idx + 1} in queue
                  </span>
                )}
                {token.status === "in_progress" && (
                  <span className="text-xs text-green-700 font-bold bg-green-100 border border-green-300 px-2 py-0.5 rounded-full animate-pulse">
                    ● In Consult
                  </span>
                )}
                {token.status === "completed" && (
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">Done</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Token Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-lg font-heading font-semibold mb-4">
              {isHindi ? "नया टोकन बनाएं" : "Generate New Token"}
            </h2>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-stone-500 block mb-1">{isHindi ? "मरीज़ का नाम" : "Patient Name"}</label>
                <input
                  type="text"
                  placeholder={isHindi ? "नाम दर्ज करें" : "Enter patient name"}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 block mb-1">ABHA ID (Optional)</label>
                <input
                  type="text"
                  placeholder="ABHA-XXXX-XXXX-XXXX"
                  value={newAbha}
                  onChange={(e) => setNewAbha(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                Walk-in token will be assigned next available number: <strong>B-00{tokens.length + 1}</strong>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNew(false)}
                className="flex-1 border border-stone-300 rounded-xl py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 bg-teal-700 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-teal-800 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
