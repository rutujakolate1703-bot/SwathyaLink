import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function SOSModal() {
  const { sosOpen, setSosOpen } = useApp();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!sosOpen) return null;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  const handleClose = () => {
    setSosOpen(false);
    setSent(false);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        {!sent ? (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="sos-ring absolute inset-0 rounded-full border-2 border-red-400" />
              </div>
            </div>

            <h2 className="text-xl font-heading font-bold text-center text-red-700 mb-1">Emergency SOS</h2>
            <p className="text-sm text-stone-500 text-center mb-4">
              This will share your location and clinical summary with the nearest facility and emergency services.
            </p>

            <div className="bg-stone-50 rounded-lg p-3 mb-4 text-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-green-600">📍</span>
                <span className="text-stone-700">Location: Village Bhimpur, Ward 3 <span className="text-stone-400 font-mono">(20.7°N 78.5°E)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span className="text-stone-700">Patient: Ramesh Kumar · ABHA-2345-6789-0123</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span className="text-stone-700">Summary: HTN, Amlodipine 10mg, Last BP 160/100</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏥</span>
                <span className="text-stone-700">Nearest: Bhimpur PHC (+91-7152-234567)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-red-600 text-white rounded-xl py-3 font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {sending ? "Sending..." : "🆘 Send SOS"}
              </button>
              <a
                href="tel:108"
                className="bg-orange-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-orange-700 transition-colors"
              >
                📞 Call 108
              </a>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              Cancel — Not an emergency
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-bold text-green-700 mb-1">SOS Alert Sent</h2>
            <p className="text-sm text-stone-500 mb-2">Bhimpur PHC has been notified. Ambulance ETA: 18 min.</p>
            <p className="text-xs font-mono text-stone-400">Ref: SOS-20240115-1142</p>
            <button
              onClick={handleClose}
              className="mt-5 w-full bg-stone-900 text-white rounded-xl py-3 font-bold text-sm hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
