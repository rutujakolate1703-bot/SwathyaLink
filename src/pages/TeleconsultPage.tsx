import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockTokens } from "../data/mock";

type ConsultPhase = "lobby" | "active" | "done";

export default function TeleconsultPage() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [phase, setPhase] = useState<ConsultPhase>("lobby");
  const [selectedPatient, setSelectedPatient] = useState(mockTokens[1]);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescriptions, setPrescriptions] = useState<string[]>(["Amlodipine 10mg OD"]);
  const [newRx, setNewRx] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { from: "doctor", text: "Hello, how are you feeling today?" },
    { from: "patient", text: "I have chest tightness since morning." },
  ]);

  const addRx = () => {
    if (newRx.trim()) { setPrescriptions((p) => [...p, newRx.trim()]); setNewRx(""); }
  };

  const sendChat = () => {
    if (chatMsg.trim()) {
      setChatHistory((h) => [...h, { from: "doctor", text: chatMsg.trim() }]);
      setChatMsg("");
    }
  };

  if (phase === "done") {
    return (
      <div className="p-4 sm:p-6 max-w-2xl">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 className="text-xl font-heading font-bold text-green-700 mb-1">Teleconsult Complete</h2>
          <p className="text-stone-500 text-sm mb-2">{selectedPatient.patientName} · Encounter saved as FHIR R4</p>
          <div className="font-mono text-xs text-stone-400 mb-6">ENC-20240115-{selectedPatient.tokenNumber}</div>
          <div className="bg-stone-50 rounded-xl p-4 text-left mb-5 space-y-2">
            <div><span className="text-xs font-semibold text-stone-500">DIAGNOSIS</span><div className="text-sm font-semibold text-stone-900">{diagnosis || "Hypertension — uncontrolled"}</div></div>
            <div><span className="text-xs font-semibold text-stone-500">PRESCRIPTIONS</span><div className="text-sm text-stone-900">{prescriptions.join(", ")}</div></div>
            <div><span className="text-xs font-semibold text-stone-500">NOTES</span><div className="text-sm text-stone-900">{notes || "BP 160/100 mmHg. Medication adjusted."}</div></div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 border border-teal-600 text-teal-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-teal-50 transition-colors">📄 FHIR Export</button>
            <button onClick={() => setPhase("lobby")} className="flex-1 bg-teal-700 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-teal-800 transition-colors">New Consult</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "टेलीकंसल्ट" : "Teleconsultation"}</h1>
          <p className="text-stone-500 text-sm mt-0.5">Assisted WebRTC · FHIR Encounter · e-Prescription</p>
        </div>
        {phase === "lobby" && (
          <button
            onClick={() => setPhase("active")}
            className="bg-teal-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-teal-800 transition-colors flex items-center gap-2"
          >
            📹 Start Consult
          </button>
        )}
      </div>

      {phase === "lobby" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Patient selector */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h2 className="font-heading font-semibold text-stone-900 mb-3">Select Patient</h2>
            <div className="space-y-2">
              {mockTokens.filter((t) => t.status !== "completed").map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedPatient(token)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left ${
                    selectedPatient.id === token.id ? "border-teal-600 bg-teal-50" : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-semibold text-sm flex-shrink-0">
                    {token.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">{token.patientName}</div>
                    <div className="font-mono text-xs text-stone-400">{token.tokenNumber}</div>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${token.status === "in_progress" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {token.status === "in_progress" ? "● Active" : "Waiting"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pre-consult checklist */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h2 className="font-heading font-semibold text-stone-900 mb-3">Pre-Consult Checklist</h2>
            <div className="space-y-2 mb-4">
              {["Patient ABHA verified", "Triage completed", "Vitals recorded by ASHA", "Camera and mic tested", "Connection stable"].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-stone-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm text-teal-800">
              <strong>Patient:</strong> {selectedPatient.patientName}<br />
              <strong>Token:</strong> {selectedPatient.tokenNumber}<br />
              <strong>Doctor:</strong> Dr. Anjali Singh · Bhimpur PHC
            </div>
          </div>
        </div>
      )}

      {phase === "active" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Video area */}
          <div className="xl:col-span-3 space-y-3">
            <div className="bg-stone-900 rounded-2xl aspect-video relative overflow-hidden flex items-center justify-center">
              <div className="text-center text-stone-400">
                <div className="text-6xl mb-3">👨‍⚕️</div>
                <div className="text-sm">Simulated video feed</div>
                <div className="text-xs text-stone-500 mt-1 font-mono">WebRTC · H.264 · 720p</div>
              </div>
              {/* Patient pip */}
              <div className="absolute bottom-3 right-3 w-28 h-20 bg-stone-800 rounded-lg border border-stone-600 flex items-center justify-center">
                <span className="text-stone-400 text-sm">📱 Patient</span>
              </div>
              {/* Controls */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                <button onClick={() => setMicOn((v) => !v)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${micOn ? "bg-white/20 hover:bg-white/30" : "bg-red-600"}`}>
                  🎙
                </button>
                <button onClick={() => setCamOn((v) => !v)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${camOn ? "bg-white/20 hover:bg-white/30" : "bg-red-600"}`}>
                  📷
                </button>
              </div>
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded font-mono animate-pulse">
                ● LIVE
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="px-3 py-2 border-b border-stone-100 text-xs font-semibold text-stone-500 uppercase tracking-wide">Chat / Assisted Notes</div>
              <div className="h-28 overflow-y-auto p-3 space-y-2">
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "doctor" ? "justify-end" : "justify-start"}`}>
                    <div className={`text-xs px-3 py-1.5 rounded-xl max-w-xs ${m.from === "doctor" ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-800"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 p-2 border-t border-stone-100">
                <input
                  className="flex-1 text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Type message or instruction..."
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                />
                <button onClick={sendChat} className="bg-teal-600 text-white rounded-lg px-3 text-xs font-semibold hover:bg-teal-700">Send</button>
              </div>
            </div>
          </div>

          {/* Consult notes panel */}
          <div className="xl:col-span-2 space-y-3">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="font-heading font-semibold text-stone-900 mb-3 text-sm">Consult Note <span className="text-xs text-stone-400 font-mono font-normal">FHIR Encounter</span></h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-500 block mb-1">Diagnosis (SNOMED)</label>
                  <input
                    className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Hypertension"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-500 block mb-1">Clinical Notes</label>
                  <textarea
                    className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    rows={3}
                    placeholder="Subjective, objective, assessment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="font-heading font-semibold text-stone-900 mb-3 text-sm">e-Prescription <span className="text-xs text-stone-400 font-mono font-normal">FHIR MedicationRequest</span></h3>
              <div className="space-y-2 mb-3">
                {prescriptions.map((rx, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-stone-50 rounded-lg px-3 py-2">
                    <span className="font-mono text-xs text-stone-400">Rx{i + 1}</span>
                    <span className="flex-1 font-semibold text-stone-800">{rx}</span>
                    <button onClick={() => setPrescriptions((p) => p.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-500">×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add medicine..."
                  value={newRx}
                  onChange={(e) => setNewRx(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRx()}
                />
                <button onClick={addRx} className="bg-stone-900 text-white rounded-lg px-3 text-xs font-semibold hover:bg-stone-700">+ Add</button>
              </div>
            </div>

            <button
              onClick={() => setPhase("done")}
              className="w-full bg-teal-700 text-white rounded-xl py-3 font-semibold text-sm hover:bg-teal-800 transition-colors"
            >
              ✓ End & Save Consult
            </button>
            <button className="w-full border border-stone-300 text-stone-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-stone-50 transition-colors">
              ↗ Create Referral
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
