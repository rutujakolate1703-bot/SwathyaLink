import { useState } from "react";
import { useApp } from "../context/AppContext";
import { triageQuestions } from "../data/mock";

type TriageResult = "self_care" | "phc" | "referral" | "emergency";

interface Answer {
  questionId: string;
  answer: string;
}

const emergencySymptoms = ["Chest pain", "Difficulty breathing"];
const referralSymptoms = ["Abdominal pain"];

function getResult(answers: Answer[]): TriageResult {
  const symptom = answers.find((a) => a.questionId === "q1")?.answer ?? "";
  const severity = answers.find((a) => a.questionId === "q3")?.answer ?? "";
  if (emergencySymptoms.includes(symptom) || severity === "7–10 (Severe)") return "emergency";
  if (referralSymptoms.includes(symptom) || severity === "4–6 (Moderate)") return "referral";
  if (severity === "1–3 (Mild)") return "self_care";
  return "phc";
}

const resultConfig: Record<TriageResult, { label: string; color: string; bg: string; icon: string; advice: string }> = {
  self_care: { label: "Self-Care at Home", color: "text-green-700", bg: "bg-green-50 border-green-300", icon: "🏡", advice: "Rest, hydrate, and monitor. Visit PHC if symptoms worsen in 48 hours." },
  phc: { label: "Visit PHC", color: "text-teal-700", bg: "bg-teal-50 border-teal-300", icon: "🏥", advice: "Please visit Bhimpur PHC. Estimated wait: 23 minutes. Generate a token below." },
  referral: { label: "Specialist Referral Advised", color: "text-amber-700", bg: "bg-amber-50 border-amber-300", icon: "↗", advice: "Your symptoms suggest specialist care at Wardha Rural Hospital. A referral will be created." },
  emergency: { label: "Emergency — Go Now", color: "text-red-700", bg: "bg-red-50 border-red-300", icon: "🚨", advice: "This may be a medical emergency. Call 108 immediately or press SOS." },
};

export default function TriagePage() {
  const { language, voiceEnabled, setSosOpen, setCurrentPage } = useApp();
  const isHindi = language === "hi";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [patientName, setPatientName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");

  const q = triageQuestions[step];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers.filter((a) => a.questionId !== q.id), { questionId: q.id, answer }];
    setAnswers(newAnswers);
    if (step < triageQuestions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setResult(getResult(newAnswers));
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setPatientName("");
  };

  const handleVoiceToggle = () => {
    if (!voiceEnabled) return;
    setIsListening((v) => !v);
    setTimeout(() => setIsListening(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "ट्राइएज" : "Digital Triage"}</h1>
        <p className="text-stone-500 text-sm mt-0.5">{isHindi ? "AI-संचालित लक्षण मूल्यांकन" : "AI-powered symptom assessment · Rule-based + voice input"}</p>
      </div>

      {/* Mode & language strip */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setInputMode("text")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${inputMode === "text" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
        >
          ⌨ Text
        </button>
        <button
          onClick={() => { setInputMode("voice"); handleVoiceToggle(); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${inputMode === "voice" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
        >
          🎙 Voice {isListening && <span className="voice-blink ml-1">●</span>}
        </button>
        <div className="ml-auto text-xs text-stone-400 font-mono">Rule engine v3.1 · IMCI + WHO</div>
      </div>

      {/* Patient name */}
      {!result && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4">
          <label className="text-sm font-semibold text-stone-700 block mb-1.5">
            {isHindi ? "मरीज़ का नाम / ABHA" : "Patient Name / ABHA ID"}
          </label>
          <input
            type="text"
            placeholder={isHindi ? "नाम या ABHA दर्ज करें" : "Enter name or ABHA ID..."}
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )}

      {!result ? (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-stone-100">
            <div
              className="h-full bg-teal-600 transition-all duration-300"
              style={{ width: `${((step + 1) / triageQuestions.length) * 100}%` }}
            />
          </div>

          <div className="p-5">
            <div className="text-xs font-mono text-stone-400 mb-2">
              Question {step + 1} of {triageQuestions.length}
            </div>
            <h2 className="text-lg font-heading font-semibold text-stone-900 mb-1">
              {isHindi ? q.questionHi : q.question}
            </h2>
            {isHindi && <p className="text-sm text-stone-500 mb-4">{q.question}</p>}

            {/* Voice indicator */}
            {isListening && (
              <div className="flex items-center gap-2 text-teal-700 text-sm mb-4 bg-teal-50 rounded-lg p-3">
                <span className="voice-blink text-lg">🎙</span>
                <span>{isHindi ? "सुन रहा हूं..." : "Listening..."}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="border border-stone-200 rounded-xl p-3.5 text-left hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <span className="font-medium text-stone-800 group-hover:text-teal-800 text-sm">{opt}</span>
                </button>
              ))}
            </div>

            {/* Image upload for skin/wound */}
            {step === 0 && (
              <div className="mt-4 border border-dashed border-stone-300 rounded-xl p-4 text-center">
                <p className="text-xs text-stone-400 mb-1">{isHindi ? "वैकल्पिक: घाव/त्वचा की फोटो अपलोड करें" : "Optional: Upload wound/skin image for AI assessment"}</p>
                <button className="text-xs text-teal-700 font-semibold hover:underline">📷 Take Photo / Upload</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`bg-white rounded-xl border-2 ${resultConfig[result].bg} overflow-hidden`}>
          <div className="p-6">
            <div className="text-5xl mb-3">{resultConfig[result].icon}</div>
            <div className={`text-xl font-heading font-bold ${resultConfig[result].color} mb-2`}>
              {resultConfig[result].label}
            </div>
            <p className="text-stone-600 text-sm mb-5">{resultConfig[result].advice}</p>

            {patientName && (
              <div className="bg-stone-50 rounded-lg p-3 mb-4 text-sm">
                <span className="font-semibold text-stone-700">Patient: </span>{patientName}
              </div>
            )}

            <div className="space-y-2">
              {result === "emergency" && (
                <button
                  onClick={() => setSosOpen(true)}
                  className="w-full bg-red-600 text-white rounded-xl py-3 font-bold text-sm hover:bg-red-700 transition-colors"
                >
                  🆘 Send Emergency SOS Now
                </button>
              )}
              {(result === "phc" || result === "referral") && (
                <button
                  onClick={() => setCurrentPage("queue")}
                  className="w-full bg-teal-700 text-white rounded-xl py-3 font-semibold text-sm hover:bg-teal-800 transition-colors"
                >
                  🎟 Generate Visit Token
                </button>
              )}
              {result === "referral" && (
                <button
                  onClick={() => setCurrentPage("referrals")}
                  className="w-full border border-teal-700 text-teal-700 rounded-xl py-3 font-semibold text-sm hover:bg-teal-50 transition-colors"
                >
                  ↗ Create Referral
                </button>
              )}
              <button
                onClick={handleReset}
                className="w-full border border-stone-300 text-stone-600 rounded-xl py-3 font-semibold text-sm hover:bg-stone-50 transition-colors"
              >
                ↺ New Triage
              </button>
            </div>

            {/* Summary */}
            <div className="mt-5 border-t border-stone-200 pt-4">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Triage Summary</div>
              {answers.map((a) => {
                const q = triageQuestions.find((q) => q.id === a.questionId);
                return (
                  <div key={a.questionId} className="flex justify-between text-xs text-stone-600 py-0.5">
                    <span className="text-stone-400">{q?.question}</span>
                    <span className="font-semibold">{a.answer}</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-xs mt-1 pt-1 border-t border-stone-100">
                <span className="text-stone-400 font-mono">Ref: TRIAGE-20240115-{Math.floor(Math.random() * 9000) + 1000}</span>
                <button className="text-teal-600 hover:underline">Save to record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
